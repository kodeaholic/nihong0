import React, { Component } from 'react';
import { connect, router } from 'dva';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Button, Input, Checkbox, Spin, Form } from 'antd';
import logoImg from 'assets/images/logo1.png';
import './index.less';
const { Link } = router;
const { Content } = Layout;
const FormItem = Form.Item;

@connect(({ login, loading }) => ({
  login,
  loading: loading.models.login
}))
export default class Login extends Component {
  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      payload: values
    });
  };

  render() {
    const { loading } = this.props;

    return (
      <Layout className="full-layout login-page">
        <Content>
          <Spin tip="登录中..." spinning={!!loading}>
            <Form onFinish={this.handleSubmit} className="login-form" initialValues={{ userName: 'admin', password: 'admin', remember: true }}>
              <div className="user-img">
                <img src={logoImg} alt="logo" />
                <b>Nihongo</b>
                <span>Admin</span>
              </div>
              <FormItem name="userName" rules={[{ required: true, message: '请输入您的用户名，示例admin' }]}>
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="用户名"
                />
              </FormItem>
              <FormItem name="password" rules={[{ required: true, message: '请输入您的密码，示例admin' }]}>
                <Input
                  size="large"
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="密码"
                />
              </FormItem>
              <FormItem name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </FormItem>
              <Link className="login-form-forgot" to="#">
                Forgot password
                </Link>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Sign in
                </Button>
              <div className="new-user">
                New？<Link to="/sign/register">Register</Link>
              </div>
            </Form>
          </Spin>
        </Content>
      </Layout>
    );
  }
}
