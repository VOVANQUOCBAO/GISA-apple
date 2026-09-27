import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {post} from './schemaTypes/post'
export default defineConfig({
 name:'gisa',title:'GISA — Quản lý bài viết',projectId:'j7fuzzrp',dataset:'production',
 plugins:[structureTool({title:'Bài viết',structure:S=>S.list().title('Nội dung GISA').items([S.documentTypeListItem('post').title('Bài viết')])})],
 schema:{types:[post]},
})
