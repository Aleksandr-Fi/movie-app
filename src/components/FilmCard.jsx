import { Component } from 'react'
import { Card } from 'antd'

export default class FilmCard extends Component {
  state = {}

  render() {
    const { Meta } = Card
    const { title, overview } = this.props
    return (
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
      >
        <Meta title={title} description={overview} />
      </Card>
    )
  }
}
