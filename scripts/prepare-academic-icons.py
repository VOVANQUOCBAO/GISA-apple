from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ICON_DIR = ROOT / "public" / "icons" / "academic-set"
GENERATED_ICONS = (
    "application-transfer.png",
    "community-impact.png",
    "gisa-strength2food-icon.png",
    "gisa-trade4sd-icon.png",
    "global-collaboration.png",
    "impact-measurement.png",
    "inclusive-community.png",
    "network-collaboration.png",
    "quality-education.png",
    "strategic-consulting.png",
)


def is_checkerboard_pixel(red: int, green: int, blue: int) -> bool:
    """Match the neutral, bright checkerboard while preserving colored artwork."""
    return min(red, green, blue) >= 218 and max(red, green, blue) - min(red, green, blue) <= 16


def remove_connected_checkerboard(path: Path) -> None:
    source = Image.open(path).convert("RGB")
    width, height = source.size
    pixels = source.load()
    background = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def enqueue_if_background(x: int, y: int) -> None:
        index = y * width + x
        if background[index]:
            return
        if is_checkerboard_pixel(*pixels[x, y]):
            background[index] = 1
            queue.append((x, y))

    for x in range(width):
        enqueue_if_background(x, 0)
        enqueue_if_background(x, height - 1)
    for y in range(height):
        enqueue_if_background(0, y)
        enqueue_if_background(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x:
            enqueue_if_background(x - 1, y)
        if x + 1 < width:
            enqueue_if_background(x + 1, y)
        if y:
            enqueue_if_background(x, y - 1)
        if y + 1 < height:
            enqueue_if_background(x, y + 1)

    result = source.convert("RGBA")
    output = result.load()
    for y in range(height):
        row = y * width
        for x in range(width):
            if background[row + x]:
                red, green, blue = pixels[x, y]
                output[x, y] = (red, green, blue, 0)

    # Neutral anti-alias pixels immediately touching the removed background get a
    # soft alpha ramp. This prevents a pale checkerboard fringe on dark sections.
    alpha = result.getchannel("A")
    alpha_pixels = alpha.load()
    softened: list[tuple[int, int, int]] = []
    for y in range(1, height - 1):
        for x in range(1, width - 1):
            if alpha_pixels[x, y] == 0:
                continue
            red, green, blue = pixels[x, y]
            if max(red, green, blue) - min(red, green, blue) > 20 or min(red, green, blue) < 184:
                continue
            if any(
                alpha_pixels[x + dx, y + dy] == 0
                for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1))
            ):
                value = min(red, green, blue)
                softened.append((x, y, max(0, min(255, int((220 - value) * 7.3)))))

    for x, y, opacity in softened:
        red, green, blue = pixels[x, y]
        output[x, y] = (red, green, blue, opacity)

    result.save(path, optimize=True)


if __name__ == "__main__":
    for icon_name in GENERATED_ICONS:
        remove_connected_checkerboard(ICON_DIR / icon_name)
        print(f"prepared {icon_name}")
