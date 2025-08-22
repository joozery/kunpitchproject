import React from 'react'
import { Link } from 'react-router-dom'

const mockArticles = [
  {
    id: 'market-trends-2025',
    title: 'แนวโน้มตลาดคอนโด 2025: ทำเลไหนน่าจับตา',
    excerpt: 'สรุปเทรนด์ราคาคอนโดทำเลรถไฟฟ้าปี 2025 และปัจจัยที่ทำให้ราคาขยับ...',
    cover: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop',
    publishedAt: '2025-01-15'
  },
  {
    id: 'buy-vs-rent',
    title: 'ซื้อหรือเช่า? เปรียบเทียบค่าใช้จ่ายและข้อควรคิด',
    excerpt: 'ตัดสินใจให้ชัดด้วยการเทียบค่าใช้จ่ายรายเดือน ภาษี ค่าบำรุงรักษา...',
    cover: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1200&auto=format&fit=crop',
    publishedAt: '2025-01-05'
  },
  {
    id: 'staging-tips',
    title: '7 เทคนิคแต่งห้องก่อนลงประกาศให้ขายง่ายขึ้น',
    excerpt: 'รูปและการจัดวางเฟอร์นิเจอร์มีผลต่อความสนใจของผู้ซื้ออย่างมาก...',
    cover: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop',
    publishedAt: '2024-12-28'
  }
]

const Articles = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-prompt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Articles & News</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockArticles.map((a) => (
            <article key={a.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow overflow-hidden">
              <img src={a.cover} alt={a.title} className="w-full h-48 object-cover"/>
              <div className="p-6">
                <div className="text-xs text-gray-500 mb-2">{new Date(a.publishedAt).toLocaleDateString('th-TH')}</div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{a.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{a.excerpt}</p>
                <Link to={`/articles/${a.id}`} className="inline-block text-blue-700 font-semibold hover:underline">Read more →</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Articles



