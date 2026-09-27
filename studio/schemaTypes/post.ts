import {defineField, defineType} from 'sanity'
export const post = defineType({
 name:'post', title:'Bài viết', type:'document',
 fields:[
  defineField({name:'title',title:'Tiêu đề',type:'string',validation:r=>r.required()}),
  defineField({name:'slug',title:'Đường dẫn bài viết',type:'slug',options:{source:'title',maxLength:96},validation:r=>r.required()}),
  defineField({name:'summary',title:'Giới thiệu ngắn',type:'text',rows:3}),
  defineField({name:'category',title:'Chuyên mục',type:'string',initialValue:'news',options:{list:[{title:'Tin tức GISA',value:'news'},{title:'Hoạt động GISA',value:'activities'},{title:'Thông báo',value:'announcements'}]}}),
  defineField({name:'cover',title:'Ảnh đại diện',type:'image',options:{hotspot:true},fields:[defineField({name:'alt',title:'Mô tả ảnh',type:'string'})]}),
  defineField({name:'body',title:'Nội dung bài viết',type:'array',of:[{type:'block'},{type:'image',options:{hotspot:true},fields:[{name:'alt',title:'Mô tả ảnh',type:'string'}]}],validation:r=>r.required()}),
 ],
 preview:{select:{title:'title',media:'cover'}},
})
