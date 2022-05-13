import config from '@/config/index'

export default ({ title, price, mPrice, cover }) => {
  return {
    width: '500rpx',
    height: '400rpx',
    views: [
      {
        type: 'image',
        url: 'https://s.re4.top/asset/sharebg.jpg',
        css: {
          left: '0rpx',
          top: '0rpx',
          width: '500rpx',
          height: '400rpx',
          background: config.primaryColor,
        },
      },
      {
        type: 'image',
        url: cover || 'https://s.re4.top/upload/labor-qdy/item/covers/ABCCi0lClBM=.jpg',
        css: {
          left: '30rpx',
          top: '140rpx',
          width: '240rpx',
          height: '240rpx',
          radius: '5rpx',
        },
      },
      {
        type: 'text',
        text: `￥${price}`,
        css: {
          left: '310rpx',
          top: '180rpx',
          width: '120rpx',
          height: '56rpx',
          fontSize: '48rpx',
          color: config.primaryColor,
          textAlign: 'center',
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
    ],
  }
}
