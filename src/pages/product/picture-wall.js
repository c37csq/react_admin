import { Upload, Icon, Modal, message } from 'antd';
import React from 'react';
import PropTypes from 'prop-types'
import { reqDeleteImg } from '../../api'
import { BASE_IMG_URL } from '../../utils/constants';
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component {
  static propTypes = {
    imgs: PropTypes.array
  }
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [
    ],
  };
  constructor(props) {
    super(props)
    let fileList = []
    const {imgs} = this.props
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: - index,
        name: img,
        status: document,
        url: BASE_IMG_URL + img
      }))
    }
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList
    }
  }
  getImgs = () => {
    return this.state.fileList.map(item => item.name)
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({ file, fileList }) => {
    if (file.status === 'done') {
      const result = file.response
      if (result.status === 0) {
        message.success('上传图片成功')
        const { name, url } = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('上传图片失败')
      }
    } else if (file.status === 'removed') {
      const result = await reqDeleteImg(file.name)
      if (result.status === 0) {
        message.success('删除图片成功')
      } else {
        message.error('删除图片失败')
      }
    }
    this.setState({ fileList })
  };


  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          accept="image/*"
          listType="picture-card"
          fileList={fileList}
          name="image"
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 5 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
export default PicturesWall