# SizeCharts · 尺码对照与换算

**6 个尺码系统 × 114 个换算方向 = 121 个内容页**,全部由**每系统一张权威表**派生——US→EU 与 EU→US 永远对得上。交互转换器(纯客户端零外呼)+ 全表页 + 每方向独立页。约 127 个静态页。

三个不掺假的事,与站群其他站同一套纪律:

- 同一系统只维护一张表,所有方向页/转换器/API 都查它;往返一致有测试兜底(US 男鞋 9↔EU 42)。
- 物理量做锚:鞋以脚长 cm(ISO 9407 蒙多体系)、戒指以内周 mm(直径=周长÷π)、裤装 EU=英寸腰围×2.54,公式公开写在页面。
- 诚实口径:服装鞋码无法定标准,每页明示"通用对照,以品牌自有尺码表为准"。

## 站点结构

| 路径 | 内容 | SEO 角色 |
|---|---|---|
| `/chart/[system]` | 总表页 ×6(男/女/童鞋、女装、男裤、戒指) | "shoe size chart" 主力词 |
| `/convert/[system]/[from]-to-[to]` | 方向页 ×114 | "us to eu shoe size" 长尾 |
| `/api/convert` | JSON(CORS 全开,?system=&from=&to=&value=) | agent 数据口 |

## 系统与单位

mens-shoe / womens-shoe / kids-shoe(US·UK·EU·cm·inch)、dress(US·UK·EU·INT·三围)、mens-pants(US·UK·EU·cm)、ring(US·UK·mm·直径)。

## 本地跑起来 / 部署

```bash
npm install && npm run dev        # 本地
npm test && npm run build         # 8 项测试(往返一致性+物理公式)后构建
```

纯静态站,无数据同步;Vercel 导入零配置;每日 CI 体检开 issue 报警。广告位已埋,配 `NEXT_PUBLIC_ADSENSE_CLIENT` 即激活。
