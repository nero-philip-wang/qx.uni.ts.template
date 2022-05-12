import config from '@/config/index'

export default ({ title, price, mPrice, cover, qr }) => {
  return {
    width: '580rpx',
    height: '860rpx',
    views: [
      {
        type: 'image',
        url: 'https://s.re4.top/asset/postbg.jpg',
        css: {
          left: '0rpx',
          top: '0rpx',
          width: '580rpx',
          height: '860rpx',
        },
      },
      {
        type: 'image',
        url: cover || 'https://s.re4.top/upload/labor-qdy/item/covers/ABCCi0lClBM=.jpg',
        css: {
          left: '65rpx',
          top: '135rpx',
          width: '450rpx',
          height: '450rpx',
          radius: '5rpx',
        },
      },
      {
        type: 'text',
        text: title || '左对齐,下划线无风才到地，有风还满空缘渠偏似雪，莫近鬓毛生',
        css: {
          left: '65rpx',
          top: '650rpx',
          width: '250rpx',
          height: '56rpx',
          fontSize: '24rpx',
          lineHeight: '28rpx',
        },
      },
      {
        type: 'text',
        text: `￥${price}`,
        css: {
          left: '80rpx',
          top: '730rpx',
          width: '250rpx',
          height: '56rpx',
          fontSize: '32rpx',
          color: config.primaryColor,
        },
      },
      {
        type: 'text',
        text: `￥${mPrice}`,
        css: {
          left: '200rpx',
          top: '740rpx',
          width: '250rpx',
          height: '56rpx',
          fontSize: '24rpx',
          color: '#dddddd',
          textDecoration: 'line-through',
        },
      },
      {
        type: 'image',
        url: qr || 'https://s.re4.top/upload/labor-qdy/item/covers/ABCCi0lClBM=.jpg',
        css: {
          left: '350rpx',
          top: '650rpx',
          width: '150rpx',
          height: '150rpx',
        },
      },
    ],
  }
}
