import React from 'react'
import { useParams, Link } from 'react-router-dom'

const contentById = {
  'market-trends-2025': {
    title: 'แนวโน้มตลาดคอนโด 2025: ทำเลไหนน่าจับตา',
    cover: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop',
    body: `ตลาดคอนโดปี 2025 มีแรงขับเคลื่อนจากการฟื้นตัวของท่องเที่ยวและออฟฟิศแบบไฮบริด\n\n- ทำเลย่านรถไฟฟ้า Interchange ยังเติบโต\n- ห้องขนาดกะทัดรัดใกล้ CBD เป็นที่ต้องการ\n- โครงการที่มี Facility ครบและค่าส่วนกลางเหมาะสมได้เปรียบ`
  },
  'buy-vs-rent': {
    title: 'ซื้อหรือเช่า? เปรียบเทียบค่าใช้จ่ายและข้อควรคิด',
    cover: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1200&auto=format&fit=crop',
    body: `ตัดสินใจด้วยข้อมูล: เปรียบเทียบเงินดาวน์ ดอกเบี้ย ค่าเช่า และความยืดหยุ่น\n\n- อยู่ระยะสั้น เช่าอาจเหมาะกว่า\n- มองเป็นสินทรัพย์ระยะยาว การซื้อช่วยสร้างมูลค่า`
  },
  'staging-tips': {
    title: '7 เทคนิคแต่งห้องก่อนลงประกาศให้ขายง่ายขึ้น',
    cover: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop',
    body: `เคล็ดลับภาพสวยและการจัดวางเฟอร์นิเจอร์ให้ห้องดูกว้าง น่าอยู่ และถ่ายรูปขึ้น`
  }
}

const ArticleDetail = () => {
  const { id } = useParams()
  const article = contentById[id]
  if (!article) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">ไม่พบบทความ</h1>
        <Link to="/articles" className="text-blue-700 hover:underline">กลับไปหน้า Articles</Link>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 font-prompt">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/articles" className="text-sm text-blue-700 hover:underline">← กลับ</Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-6">{article.title}</h1>
        <img src={article.cover} alt={article.title} className="w-full h-64 object-cover rounded-2xl shadow mb-8"/>
        <div className="prose max-w-none leading-relaxed whitespace-pre-wrap text-gray-800">
          {article.body}
        </div>
      </article>
    </div>
  )
}

export default ArticleDetail



