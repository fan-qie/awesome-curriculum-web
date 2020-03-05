import { Avatar, Drawer, Icon, Layout, Modal, Popover } from 'antd';
import React from 'react';
import { getAvatar } from '../../utils/auth';
import Chat from '../Chat/Chat';
import Draw from '../Draw/Draw';
import UserInfo from '../UserInfo/UserInfo';

import './Head.css';

interface IProps {
  downloadImg: any;
}

interface IState {
  drawVisible: boolean;
  modalVisible: boolean;
  chatModalVisible: boolean;
}

const { Header } = Layout;
class Head extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      drawVisible: false,
      modalVisible: false,
      chatModalVisible: false,
    };
  }

  public downloadImg = () => {
    this.props.downloadImg();
  }

  public openDrawer = () => {
    this.setState({
      drawVisible: true,
    });
  }
  public onDrawerClose = () => {
    this.setState({
      drawVisible: false,
    });
  }

  /**
   * modalCancle
   */
  public modalCancle = () => {
    this.setState({
      modalVisible: false,
    });
  }

  /**
   * chatModalCancle
   */
  public chatModalCancle = () => {
    this.setState({
      chatModalVisible: false,
    });
  }

  /**
   * showUserModal
   */
  public showUserModal = () => {
    this.setState({
      modalVisible: true,
    });
  }

  /**
   * showChatModal
   */
  public showChatModal = () => {
    this.setState({
      chatModalVisible: true,
    });
  }

  public render() {
    return (
      <div>
        <Header className='head'>
          <Popover content='打开菜单' placement='bottom'>
            <div className='head__item menu' onClick={this.openDrawer}>
              <Icon type='menu' className='head__item-icon' />
            </div>
          </Popover>
          <div className='head__item img'>
            <img src={require('../../assets/img/logo.png')} alt='课程助手' className='head__name-img' />
            <span className='head__name-text'>课程助手</span>
          </div>
          <Popover content='保存课表' placement='bottom'>
            <div className='head__item download' onClick={this.downloadImg}>
              <Icon type='cloud-download' className='head__item-icon' />
            </div>
          </Popover>
          <Popover content='进入课程群聊' placement='bottom'>
            <div className='head__item' onClick={this.showChatModal}>
              <Icon type='sound' className='head__item-icon' />
            </div>
          </Popover>
          <div onClick={this.showUserModal}>
            <Avatar
              src={getAvatar()}
              className='head__avatar'
            />
          </div>
        </Header>
        <Drawer
          title='我的菜单'
          placement='left'
          closable={false}
          onClose={this.onDrawerClose}
          visible={this.state.drawVisible}
        >
          <Draw />
        </Drawer>

        <Modal
          visible={this.state.modalVisible}
          onCancel={this.modalCancle}
          centered={true}
          footer={null}
          className='userModal'
        >
          <UserInfo />
        </Modal>

        <Modal
          visible={this.state.chatModalVisible}
          onCancel={this.chatModalCancle}
          centered={true}
          footer={null}
          className='chatModal'
        >
          <Chat />
        </Modal>
      </div>
    );
  }
}

export default Head;
