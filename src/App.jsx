import { useState, useEffect } from "react";
import { Layout, Menu, Button, Typography, Card, Avatar, List, message, Modal, Form, Input, Select, DatePicker, TimePicker, Badge, Divider, Table, Tag } from "antd";
import { UserOutlined, LoginOutlined, UserAddOutlined, CoffeeOutlined, CalendarOutlined, UserSwitchOutlined, DollarOutlined, MessageOutlined } from "@ant-design/icons";
import "./App.css";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

function App() {
  const [current, setCurrent] = useState('home');
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isAppointmentModalVisible, setIsAppointmentModalVisible] = useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  // 老师列表，从localStorage加载
  const [teachers, setTeachers] = useState(() => {
    const savedTeachers = localStorage.getItem('coffee-app-teachers');
    try {
      return savedTeachers ? JSON.parse(savedTeachers) : [];
    } catch (error) {
      console.error('Failed to parse teachers from localStorage:', error);
      return [];
    }
  });
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = localStorage.getItem('coffee-app-appointments');
    try {
      return savedAppointments ? JSON.parse(savedAppointments) : [];
    } catch (error) {
      console.error('Failed to parse appointments from localStorage:', error);
      return [];
    }
  });
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [appointmentForm] = Form.useForm();
  const [feedbackForm] = Form.useForm();
  const [teacherProfileForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isTeacherProfileModalVisible, setIsTeacherProfileModalVisible] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [isMeetingModeModalVisible, setIsMeetingModeModalVisible] = useState(false);
  const [currentAppointmentForMeetingMode, setCurrentAppointmentForMeetingMode] = useState(null);
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [currentChatAppointment, setCurrentChatAppointment] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  // 搜索和筛选状态
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterGender, setFilterGender] = useState('');
  
  // 模拟用户数据库（含管理员），从localStorage加载
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('coffee-app-users');
    try {
      return savedUsers ? JSON.parse(savedUsers) : [
        { id: 1, username: 'admin', password: 'admin', role: 'admin', name: '管理员' }
      ];
    } catch (error) {
      console.error('Failed to parse users from localStorage:', error);
      return [
        { id: 1, username: 'admin', password: 'admin', role: 'admin', name: '管理员' }
      ];
    }
  });

  // 聊天消息，从localStorage加载
  const [chatMessagesByAppointment, setChatMessagesByAppointment] = useState(() => {
    const savedChatMessages = localStorage.getItem('coffee-app-chat-messages');
    try {
      return savedChatMessages ? JSON.parse(savedChatMessages) : {};
    } catch (error) {
      console.error('Failed to parse chat messages from localStorage:', error);
      return {};
    }
  });
  
  // 管理员预约列表
  const [adminAppointments, setAdminAppointments] = useState([]);
  
  // 漂流瓶功能
  const [isBottleModalVisible, setIsBottleModalVisible] = useState(false);
  const [isFoundBottleModalVisible, setIsFoundBottleModalVisible] = useState(false);
  const [isMyBottlesModalVisible, setIsMyBottlesModalVisible] = useState(false);
  const [bottleContent, setBottleContent] = useState('');
  const [currentBottle, setCurrentBottle] = useState(null);
  const [bottleReply, setBottleReply] = useState('');
  
  // 漂流瓶列表，从localStorage加载
  const [bottles, setBottles] = useState(() => {
    const savedBottles = localStorage.getItem('coffee-app-bottles');
    try {
      return savedBottles ? JSON.parse(savedBottles) : [];
    } catch (error) {
      console.error('Failed to parse bottles from localStorage:', error);
      return [];
    }
  });

  // 模拟老师数据
  const mockTeachers = [];

  // 模拟预约数据
  const mockAppointments = [];

  // 保存用户数据到localStorage
  useEffect(() => {
    localStorage.setItem('coffee-app-users', JSON.stringify(users));
  }, [users]);

  // 保存老师数据到localStorage
  useEffect(() => {
    localStorage.setItem('coffee-app-teachers', JSON.stringify(teachers));
  }, [teachers]);

  // 保存漂流瓶数据到localStorage
  useEffect(() => {
    localStorage.setItem('coffee-app-bottles', JSON.stringify(bottles));
  }, [bottles]);

  // 保存预约数据到localStorage
  useEffect(() => {
    localStorage.setItem('coffee-app-appointments', JSON.stringify(appointments));
  }, [appointments]);

  // 当appointments变化时，更新管理员预约列表
  useEffect(() => {
    setAdminAppointments(appointments);
  }, [appointments]);

  // 保存聊天消息到localStorage
  useEffect(() => {
    localStorage.setItem('coffee-app-chat-messages', JSON.stringify(chatMessagesByAppointment));
  }, [chatMessagesByAppointment]);

  // 当user变化时，更新currentTeacher
  useEffect(() => {
    if (user && user.role === 'teacher') {
      const teacherData = teachers.find(t => t.id === user.id);
      if (teacherData) {
        setCurrentTeacher(teacherData);
      } else {
        // 转换性别值，将注册时的'male'/'female'转换为'男'/'女'
        let gender = '';
        if (user.gender === 'male') {
          gender = '男';
        } else if (user.gender === 'female') {
          gender = '女';
        } else if (user.gender === 'other') {
          gender = '其他';
        }
        
        // 如果找不到，创建一个默认的（未发布状态）
        const defaultTeacherData = {
          id: user.id,
          name: user.name,
          professional_title: '未设置',
          available_time: '周一至周五 9:00-17:00',
          gender: gender,
          published: false
        };
        setCurrentTeacher(defaultTeacherData);
        // 不自动添加到teachers列表，需要手动发布后才可见
      }
    }
  }, [user, teachers]);

  // 过滤后的老师列表 - 只显示已发布的陪伴者
  const filteredTeachers = teachers.filter(teacher => {
    // 只显示已发布的陪伴者
    if (!teacher.published) return false;
    const matchesSearch = teacher.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         teacher.professional_title.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesFilter = filterGender ? teacher.gender === filterGender : true;
    return matchesSearch && matchesFilter;
  });

  // 性别选项
  const genderOptions = [
    { value: '男', label: '男' },
    { value: '女', label: '女' }
  ];


  // 登录
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      // 模拟登录
      setTimeout(() => {
        // 查找用户
        const foundUser = users.find(user => user.username === values.username && user.password === values.password);
        if (!foundUser) {
          message.error('登录失败: 用户名或密码错误');
          setLoading(false);
          return;
        }
        
        const userData = {
          id: foundUser.id,
          username: foundUser.username,
          role: foundUser.role,
          name: foundUser.name
        };
        setUser(userData);
        
        // 如果是陪伴者角色，初始化当前陪伴者信息
        if (foundUser.role === 'teacher') {
          // 转换性别值，将注册时的'male'/'female'转换为'男'/'女'
          let gender = '';
          if (foundUser.gender === 'male') {
            gender = '男';
          } else if (foundUser.gender === 'female') {
            gender = '女';
          } else if (foundUser.gender === 'other') {
            gender = '其他';
          }
          
          const teacherData = {
            id: foundUser.id,
            name: foundUser.name,
            professional_title: '未设置',
            available_time: '周一至周五 9:00-17:00',
            gender: gender,
            published: false
          };
          setCurrentTeacher(teacherData);
          
          // 不自动添加到teachers列表，需要手动发布后才可见
        }
        
        localStorage.setItem('token', 'mock-token');
        setIsLoginModalVisible(false);
        message.success('登录成功');
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('登录失败: 用户名或密码错误');
      setLoading(false);
    }
  };

  // 注册
  const handleRegister = async (values) => {
    setLoading(true);
    try {
      // 检查用户名是否已存在
      const existingUser = users.find(user => user.username === values.username);
      if (existingUser) {
        message.error('用户名已存在');
        setLoading(false);
        return;
      }
      
      // 模拟注册
      setTimeout(() => {
        const newUser = {
          id: users.length + 1,
          username: values.username,
          password: values.password,
          role: values.role,
          name: values.name, // 使用用户输入的姓名
          gender: values.gender
        };
        setUsers([...users, newUser]);
        setIsRegisterModalVisible(false);
        message.success('注册成功，请登录');
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('注册失败');
      setLoading(false);
    }
  };

  // 预约
  const handleAppointment = async (values) => {
    setLoading(true);
    try {
      // 模拟预约
      setTimeout(() => {
        setIsAppointmentModalVisible(false);
        message.success('预约成功');
        // 模拟添加新预约
        const newAppointment = {
          id: appointments.length + 1,
          student_id: user.id,
          student_name: user.name,
          student_username: user.username,
          teacher_id: selectedTeacher.id,
          teacher_name: selectedTeacher.name,
          appointment_time: `${values.date.format('YYYY-MM-DD')} ${values.time.format('HH:mm:ss')}`,
          location: values.location,
          status: 'pending'
        };
        setAppointments([...appointments, newAppointment]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('预约失败');
      setLoading(false);
    }
  };

  // 提交反馈
  const handleFeedback = async (values) => {
    setLoading(true);
    try {
      // 模拟提交反馈
      setTimeout(() => {
        setIsFeedbackModalVisible(false);
        message.success('反馈提交成功');
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('反馈提交失败');
      setLoading(false);
    }
  };

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCurrentTeacher(null);
    setCurrent('home');
    message.success('退出登录成功');
  };

  // 打开预约模态框
  const openAppointmentModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsAppointmentModalVisible(true);
  };

  // 打开反馈模态框
  const openFeedbackModal = (appointment) => {
    feedbackForm.setFieldsValue({ appointment_id: appointment.id });
    setIsFeedbackModalVisible(true);
  };

  // 确认预约（老师）
  const handleConfirmAppointment = async (appointment) => {
    setLoading(true);
    try {
      // 模拟确认预约
      setTimeout(() => {
        const updatedAppointments = appointments.map(item => 
          item.id === appointment.id ? { ...item, status: 'confirmed', meetingMode: null } : item
        );
        setAppointments(updatedAppointments);
        message.success('预约已确认，请等待学生选择见面方式');
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('确认预约失败');
      setLoading(false);
    }
  };

  // 完成预约（老师）
  const handleCompleteAppointment = async (appointment) => {
    setLoading(true);
    try {
      // 模拟完成预约
      setTimeout(() => {
        const updatedAppointments = appointments.map(item => 
          item.id === appointment.id ? { ...item, status: 'completed' } : item
        );
        setAppointments(updatedAppointments);
        message.success('预约已完成');
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('完成预约失败');
      setLoading(false);
    }
  };

  // 取消预约（学生或老师）
  const handleCancelAppointment = async (appointment) => {
    setLoading(true);
    try {
      // 模拟取消预约
      setTimeout(() => {
        const updatedAppointments = appointments.map(item => 
          item.id === appointment.id ? { ...item, status: 'cancelled' } : item
        );
        setAppointments(updatedAppointments);
        message.success('预约已取消');
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('取消预约失败');
      setLoading(false);
    }
  };

  // 删除预约（用户）
  const handleDeleteUserAppointment = async (appointment) => {
    setLoading(true);
    try {
      // 模拟删除预约
      setTimeout(() => {
        const updatedAppointments = appointments.filter(item => item.id !== appointment.id);
        setAppointments(updatedAppointments);
        message.success('预约已删除');
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('删除预约失败');
      setLoading(false);
    }
  };

  // 处理更换头像
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setAvatarImage(imageUrl);
        // 更新currentTeacher的头像
        if (currentTeacher) {
          const updatedTeacher = { ...currentTeacher, avatar: imageUrl };
          setCurrentTeacher(updatedTeacher);
          // 更新teachers列表
          setTeachers(teachers.map(t => t.id === currentTeacher.id ? updatedTeacher : t));
        }
        message.success('头像更新成功');
      };
      reader.readAsDataURL(file);
    }
  };

  // 打开文件选择器
  const openFileSelector = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = handleAvatarChange;
    fileInput.click();
  };

  // 打开选择见面方式模态框
  const openMeetingModeModal = (appointment) => {
    setCurrentAppointmentForMeetingMode(appointment);
    setIsMeetingModeModalVisible(true);
  };

  // 选择见面方式
  const handleSelectMeetingMode = (mode) => {
    if (!currentAppointmentForMeetingMode) return;
    
    const updatedAppointments = appointments.map(item => 
      item.id === currentAppointmentForMeetingMode.id ? 
      { ...item, meetingMode: mode } : item
    );
    setAppointments(updatedAppointments);
    setIsMeetingModeModalVisible(false);
    setCurrentAppointmentForMeetingMode(null);
    message.success(`已选择${mode === 'online' ? '线上匿名聊天' : '线下见面'}`);
  };

  // 打开聊天模态框
  const openChatModal = (appointment) => {
    if (appointment.meetingMode !== 'online') {
      message.warning('只有选择线上匿名聊天的预约才能进行聊天');
      return;
    }
    
    setCurrentChatAppointment(appointment);
    // 加载该预约的聊天记录，并根据用户角色设置isMe字段
    const messages = chatMessagesByAppointment[appointment.id] || [];
    const updatedMessages = messages.map(msg => ({
      ...msg,
      isMe: msg.sender === (user?.role === 'student' ? '学生' : '陪伴者')
    }));
    setChatMessages(updatedMessages);
    setIsChatModalVisible(true);
  };

  // 发送消息
  const handleSendMessage = () => {
    if (!chatInput.trim() || !currentChatAppointment) return;
    
    const sender = user?.role === 'student' ? '学生' : '陪伴者';
    const newMessage = {
      id: Date.now(),
      sender: sender,
      content: chatInput,
      timestamp: new Date().toLocaleTimeString(),
      isMe: true
    };
    
    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    setChatInput('');
    
    // 保存聊天记录
    setChatMessagesByAppointment(prev => ({
      ...prev,
      [currentChatAppointment.id]: updatedMessages
    }));
  };



  // 删除预约（管理员）
  const handleDeleteAdminAppointment = (appointmentId) => {
    setAdminAppointments(adminAppointments.filter(appointment => appointment.id !== appointmentId));
    message.success('预约已删除');
  };

  // 删除用户（管理员）
  const handleDeleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
    message.success('用户已删除');
  };

  // 发布陪伴者个人信息
  const handlePublishProfile = () => {
    if (!currentTeacher || !currentTeacher.name || !currentTeacher.professional_title || !currentTeacher.available_time) {
      message.error('请先编辑并完善个人信息');
      return;
    }
    
    // 标记为已发布
    const teacherToPublish = { ...currentTeacher, published: true };
    setCurrentTeacher(teacherToPublish);
    
    // 检查陪伴者是否已在列表中
    const existingTeacherIndex = teachers.findIndex(teacher => teacher.id === currentTeacher.id);
    let updatedTeachers;
    
    if (existingTeacherIndex >= 0) {
      // 更新现有陪伴者信息
      updatedTeachers = [...teachers];
      updatedTeachers[existingTeacherIndex] = teacherToPublish;
    } else {
      // 添加新陪伴者到列表
      updatedTeachers = [...teachers, teacherToPublish];
    }
    
    setTeachers(updatedTeachers);
    message.success('个人信息已发布，其他用户可以在陪伴者列表中看到');
  };

  // 打开陪伴者个人信息编辑模态框
  const openTeacherProfileModal = () => {
    if (currentTeacher) {
      teacherProfileForm.setFieldsValue({
        name: currentTeacher.name,
        professional_title: currentTeacher.professional_title,
        available_time: currentTeacher.available_time,
        gender: currentTeacher.gender
      });
    }
    setIsTeacherProfileModalVisible(true);
  };

  // 保存陪伴者个人信息
  const handleSaveTeacherProfile = async (values) => {
    setLoading(true);
    try {
      setTimeout(() => {
        // 更新当前陪伴者信息，标记为已发布
        const updatedTeacher = {
          ...currentTeacher,
          name: values.name,
          professional_title: values.professional_title,
          available_time: values.available_time,
          gender: values.gender,
          published: true
        };
        setCurrentTeacher(updatedTeacher);
        
        // 检查陪伴者是否已在列表中
        const existingTeacherIndex = teachers.findIndex(teacher => teacher.id === currentTeacher.id);
        let updatedTeachers;
        
        if (existingTeacherIndex >= 0) {
          // 更新现有陪伴者信息
          updatedTeachers = [...teachers];
          updatedTeachers[existingTeacherIndex] = updatedTeacher;
        } else {
          // 添加新陪伴者到列表
          updatedTeachers = [...teachers, updatedTeacher];
        }
        
        setTeachers(updatedTeachers);
        
        setIsTeacherProfileModalVisible(false);
        message.success('个人信息保存成功，已发布到陪伴者列表');
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('保存失败');
      setLoading(false);
    }
  };

  // 漂流瓶功能
  // 扔漂流瓶
  const handleThrowBottle = () => {
    if (!user) {
      message.error('请先登录');
      return;
    }
    if (!bottleContent.trim()) {
      message.error('请输入漂流瓶内容');
      return;
    }
    
    const newBottle = {
      id: Date.now() + Math.random(),
      content: bottleContent.trim(),
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      hasBeenFound: false,
      replies: []
    };
    
    setBottles([...bottles, newBottle]);
    setBottleContent('');
    setIsBottleModalVisible(false);
    message.success('漂流瓶已扔出，期待有人捡到它！');
  };

  // 捡漂流瓶
  const handlePickBottle = () => {
    // 找到未被捡起的漂流瓶
    const availableBottles = bottles.filter(bottle => !bottle.hasBeenFound);
    
    if (availableBottles.length === 0) {
      message.info('暂时没有漂流瓶，稍后再来试试吧！');
      return;
    }
    
    // 随机选择一个漂流瓶
    const randomIndex = Math.floor(Math.random() * availableBottles.length);
    const foundBottle = availableBottles[randomIndex];
    
    // 标记为已被捡起
    const updatedBottles = bottles.map(bottle => 
      bottle.id === foundBottle.id ? { ...bottle, hasBeenFound: true } : bottle
    );
    setBottles(updatedBottles);
    
    setCurrentBottle(foundBottle);
    setBottleReply('');
    setIsFoundBottleModalVisible(true);
  };

  // 回复漂流瓶
  const handleReplyBottle = () => {
    if (!bottleReply.trim()) {
      message.error('请输入回复内容');
      return;
    }
    
    const updatedBottles = bottles.map(bottle => {
      if (bottle.id === currentBottle.id) {
        return {
          ...bottle,
          replies: [...bottle.replies, {
            id: Date.now() + Math.random(),
            content: bottleReply.trim(),
            createdAt: new Date().toISOString()
          }]
        };
      }
      return bottle;
    });
    
    setBottles(updatedBottles);
    setBottleReply('');
    setIsFoundBottleModalVisible(false);
    message.success('回复已发送，希望能给对方带来温暖！');
  };

  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="logo">
          <span style={{ fontSize: '24px' }}>☕</span>
          <span style={{ color: '#fff', marginLeft: '10px', fontSize: '28px', fontWeight: '800', fontFamily: 'Segoe Print, Comic Sans MS, cursive' }}>遇见</span>
        </div>
        <Menu theme="dark" mode="horizontal" selectedKeys={[current]} style={{ flex: 1, maxWidth: '800px', marginLeft: '50px' }}>
          <Menu.Item key="home" icon={<span>🏠</span>} onClick={() => setCurrent('home')}>
            首页
          </Menu.Item>
          {user?.role === 'student' && (
            <Menu.Item key="teachers" icon={<span>💝</span>} onClick={() => setCurrent('teachers')}>
              陪伴者
            </Menu.Item>
          )}
          {user?.role === 'student' && (
            <Menu.Item key="appointments" icon={<span>📅</span>} onClick={() => setCurrent('appointments')}>
              我的预约
            </Menu.Item>
          )}
          {user && (
            <Menu.Item key="bottle" icon={<span>🌊</span>} onClick={() => setCurrent('bottle')}>
              漂流瓶
            </Menu.Item>
          )}
          {user?.role === 'teacher' && (
            <Menu.Item key="teacher-appointments" icon={<span>📋</span>} onClick={() => setCurrent('teacher-appointments')}>
              预约管理
            </Menu.Item>
          )}
          {user?.role === 'teacher' && (
            <Menu.Item key="teacher-profile" icon={<span>👤</span>} onClick={() => setCurrent('teacher-profile')}>
              个人信息
            </Menu.Item>
          )}
          {user?.role === 'admin' && (
            <Menu.Item key="admin-users" icon={<span>👥</span>} onClick={() => setCurrent('admin-users')}>
              账号管理
            </Menu.Item>
          )}
          {user?.role === 'admin' && (
            <Menu.Item key="admin-appointments" icon={<span>📊</span>} onClick={() => setCurrent('admin-appointments')}>
              预约管理
            </Menu.Item>
          )}
        </Menu>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Text style={{ color: '#fff', marginRight: '10px' }}>{user.username}</Text>
              <Button type="primary" danger onClick={handleLogout}>退出登录</Button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button type="primary" icon={<span>🔐</span>} onClick={() => {
                loginForm.resetFields();
                setIsLoginModalVisible(true);
              }}>
                登录
              </Button>
              <Button icon={<span>✨</span>} onClick={() => {
                registerForm.resetFields();
                setIsRegisterModalVisible(true);
              }}>
                注册
              </Button>
            </div>
          )}
        </div>
      </Header>
      <Content style={{ padding: '40px' }}>
        <div className="site-layout-content">
          {current === 'home' && (
            <div className="home-content">
              <div className="hero-section">
                <Title level={1} style={{ color: '#1890ff', marginBottom: '20px' }}>温暖相伴，遇见自己</Title>
                <Paragraph style={{ 
                  fontSize: '20px', 
                  lineHeight: '2',
                  color: '#595959',
                  maxWidth: '800px',
                  margin: '0 auto 30px',
                  textAlign: 'center',
                  letterSpacing: '0.5px'
                }}>
                  在这里，你可以与他人轻松交流，分享你的青春故事和成长烦恼。<br />
                  一杯咖啡，一段对话，或许就能为你带来新的视角，让心情更加明朗。
                </Paragraph>
                <Button type="primary" size="large" style={{ marginTop: '20px' }} onClick={() => setCurrent('teachers')}>
                  立即预约
                </Button>
              </div>
              <div className="features-section">
                <div className="features-grid">
                  <Card hoverable style={{ margin: '10px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>💬</div>
                    <Title level={4}>线上匿名</Title>
                    <Paragraph>提供匿名线上聊天功能，保护你的隐私，让你更自由地表达心声。</Paragraph>
                  </Card>
                  <Card hoverable style={{ margin: '10px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>💝</div>
                    <Title level={4}>耐心陪伴</Title>
                    <Paragraph>我们会耐心倾听你的心声，青春烦恼尽可倾诉。</Paragraph>
                  </Card>
                  <Card hoverable style={{ margin: '10px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>📅</div>
                    <Title level={4}>灵活预约</Title>
                    <Paragraph>你可以根据自己的时间安排，选择合适的老师和时间进行预约。</Paragraph>
                  </Card>
                </div>
              </div>
            </div>
          )}
          {current === 'teachers' && (
            <div className="teachers-content">
              <Title level={2} style={{ marginBottom: '30px' }}>陪伴者</Title>
              <div style={{ marginBottom: '30px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Input.Search
                  placeholder="搜索陪伴者姓名或职称"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  style={{ width: '300px' }}
                />
                <Select
                  placeholder="按性别筛选"
                  value={filterGender || undefined}
                  onChange={setFilterGender}
                  style={{ width: '200px' }}
                  allowClear
                >
                  {genderOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
                <Button
                  type="default"
                  onClick={() => {
                    setSearchKeyword('');
                    setFilterGender('');
                  }}
                >
                  重置筛选
                </Button>
              </div>
              <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={filteredTeachers}
                renderItem={teacher => (
                  <List.Item>
                    <Card
                      hoverable
                      cover={<div className="teacher-cover" style={{ height: '200px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {teacher.avatar ? (
                          <img src={teacher.avatar} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <UserOutlined style={{ fontSize: '80px', color: '#1890ff' }} />
                        )}
                      </div>}
                      actions={[
                      <Button key="view" type="primary" onClick={() => openAppointmentModal(teacher)}>
                        预约
                      </Button>
                    ]}
                    >
                      <Card.Meta
                        title={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{teacher.name}</span>
                          </div>
                        }
                        description={
                          <div>
                            <p style={{ fontSize: '12px', color: '#666', margin: '4px 0' }}>{teacher.professional_title}</p>
                            {teacher.gender && (
                              <p style={{ fontSize: '12px', color: '#666', margin: '4px 0' }}>性别: {teacher.gender}</p>
                            )}
                          </div>
                        }
                      />
                      <Text style={{ fontSize: '12px', color: '#666', display: 'block', marginTop: '8px' }}>
                        可用时间: {teacher.available_time}
                      </Text>
                    </Card>
                  </List.Item>
                )}
                locale={{ emptyText: '没有找到匹配的陪伴者' }}
              />
            </div>
          )}
          {current === 'appointments' && user && user.role === 'student' && (
            <div className="appointments-content">
              <Title level={2} style={{ marginBottom: '30px' }}>我的预约</Title>
              <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={user ? appointments.filter(appointment => appointment.student_id === user.id) : []}
                renderItem={appointment => (
                  <List.Item>
                    <Card
                      hoverable
                      style={{ width: '100%' }}
                      actions={[
                        appointment.status === 'confirmed' && !appointment.meetingMode && (
                          <Button key="meeting-mode" type="primary" size="small" onClick={() => openMeetingModeModal(appointment)}>
                            选择见面方式
                          </Button>
                        ),
                        appointment.status === 'confirmed' && appointment.meetingMode === 'online' && (
                          <Button key="chat" type="primary" size="small" onClick={() => openChatModal(appointment)}>
                            聊天
                          </Button>
                        ),
                        appointment.status === 'completed' && (
                          <Button key="delete" danger size="small" onClick={() => handleDeleteUserAppointment(appointment)}>
                            删除
                          </Button>
                        )
                      ]}
                    >
                      <Card.Meta
                        title={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                            <span>{appointment.teacher_name}</span>
                            <Badge status={
                              appointment.status === 'pending' ? 'default' :
                              appointment.status === 'confirmed' ? 'processing' :
                              appointment.status === 'completed' ? 'success' : 'error'
                            } text={
                              appointment.status === 'pending' ? '待确认' :
                              appointment.status === 'confirmed' ? '已确认' :
                              appointment.status === 'completed' ? '已完成' : '已取消'
                            } />
                          </div>
                        }
                        description={
                          <div style={{ fontSize: '12px' }}>
                            <p style={{ margin: '4px 0' }}>{appointment.appointment_time}</p>
                            <p style={{ margin: '4px 0' }}>{appointment.location}</p>
                            {appointment.meetingMode && (
                              <p style={{ margin: '4px 0', color: '#1890ff' }}>
                                见面方式: {appointment.meetingMode === 'online' ? '线上匿名聊天' : '线下见面'}
                              </p>
                            )}
                          </div>
                        }
                      />
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          )}
          {current === 'teacher-appointments' && user && user.role === 'teacher' && (
            <div className="appointments-content">
              <Title level={2} style={{ marginBottom: '30px' }}>预约管理</Title>

              <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={appointments.filter(appointment => appointment.teacher_id === user?.id)}
                renderItem={appointment => (
                  <List.Item>
                    <Card
                      hoverable
                      style={{ width: '100%' }}
                      actions={[
                        appointment.status === 'pending' && (
                          <>
                            <Button key="confirm" type="primary" size="small" onClick={() => handleConfirmAppointment(appointment)}>
                              确认
                            </Button>
                            <Button key="cancel" danger size="small" onClick={() => handleCancelAppointment(appointment)}>
                              取消
                            </Button>
                          </>
                        ),
                        appointment.status === 'confirmed' && appointment.meetingMode === 'online' && (
                          <Button key="chat" type="primary" size="small" onClick={() => openChatModal(appointment)}>
                            聊天
                          </Button>
                        ),
                        appointment.status === 'confirmed' && (
                          <Button key="complete" type="primary" size="small" onClick={() => handleCompleteAppointment(appointment)}>
                            完成
                          </Button>
                        ),
                        appointment.status === 'completed' && (
                          <Button key="delete" danger size="small" onClick={() => handleDeleteUserAppointment(appointment)}>
                            删除
                          </Button>
                        )
                      ]}
                    >
                      <Card.Meta
                        title={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                            <span>{appointment.student_username || appointment.student_name}</span>
                            <Badge status={
                              appointment.status === 'pending' ? 'default' :
                              appointment.status === 'confirmed' ? 'processing' :
                              appointment.status === 'completed' ? 'success' : 'error'
                            } text={
                              appointment.status === 'pending' ? '待确认' :
                              appointment.status === 'confirmed' ? '已确认' :
                              appointment.status === 'completed' ? '已完成' : '已取消'
                            } />
                          </div>
                        }
                        description={
                          <div style={{ fontSize: '12px' }}>
                            <p style={{ margin: '4px 0' }}>{appointment.appointment_time}</p>
                            <p style={{ margin: '4px 0' }}>{appointment.location}</p>
                            {appointment.meetingMode && (
                              <p style={{ margin: '4px 0', color: '#1890ff' }}>
                                见面方式: {appointment.meetingMode === 'online' ? '线上匿名聊天' : '线下见面'}
                              </p>
                            )}
                          </div>
                        }
                      />
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          )}
          {current === 'teacher-profile' && user && user.role === 'teacher' && (
            <div className="teacher-profile-content">
              <Title level={2} style={{ marginBottom: '30px' }}>个人信息</Title>
              <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={openFileSelector}>
                    {avatarImage || currentTeacher?.avatar ? (
                      <Avatar size={80} style={{ marginBottom: '20px' }} src={avatarImage || currentTeacher?.avatar} />
                    ) : (
                      <Avatar size={80} style={{ marginBottom: '20px' }}>{currentTeacher?.name?.[0] || '陪'}</Avatar>
                    )}
                    <div style={{ position: 'absolute', bottom: '20px', right: '0', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '12px' }}>
                      更换
                    </div>
                  </div>
                  <Title level={3}>{currentTeacher?.name || '未设置'}</Title>
                  <Text type="secondary">{currentTeacher?.professional_title || '未设置'}</Text>
                  <div style={{ marginTop: '10px' }}>
                    {currentTeacher?.published ? (
                      <span style={{ color: '#52c41a', fontSize: '14px' }}>✓ 已发布（其他用户可见）</span>
                    ) : (
                      <span style={{ color: '#faad14', fontSize: '14px' }}>⚠ 未发布（其他用户不可见）</span>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: '30px' }}>
                  <p><strong>可用时间：</strong>{currentTeacher?.available_time || '未设置'}</p>
                </div>
                <div style={{ textAlign: 'center', marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <Button type="primary" onClick={openTeacherProfileModal}>
                    编辑信息
                  </Button>
                  <Button type="default" onClick={() => handlePublishProfile()}>
                    发布
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {current === 'bottle' && user && (
            <div className="bottle-content">
              <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>漂流瓶</Title>
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Card hoverable style={{ marginBottom: '30px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', color: '#1890ff', marginBottom: '20px' }}>🍾</div>
                  <Title level={3}>扔一个漂流瓶</Title>
                  <Paragraph style={{ marginBottom: '30px' }}>把你的烦恼、困惑或心情写进漂流瓶，让它飘向未知的远方</Paragraph>
                  <Button type="primary" size="large" onClick={() => setIsBottleModalVisible(true)}>
                    开始写漂流瓶
                  </Button>
                </Card>
                
                <Card hoverable style={{ marginBottom: '30px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', color: '#1890ff', marginBottom: '20px' }}>🔍</div>
                  <Title level={3}>捡一个漂流瓶</Title>
                  <Paragraph style={{ marginBottom: '30px' }}>随机捡到一个漂流瓶，给对方一个温暖的回复</Paragraph>
                  <Button type="primary" size="large" onClick={handlePickBottle}>
                    开始捡漂流瓶
                  </Button>
                </Card>
                
                <Card hoverable style={{ marginBottom: '30px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', color: '#1890ff', marginBottom: '20px' }}>📬</div>
                  <Title level={3}>我的漂流瓶</Title>
                  <Paragraph style={{ marginBottom: '30px' }}>查看你扔出的漂流瓶和收到的回复</Paragraph>
                  <Button type="primary" size="large" onClick={() => setIsMyBottlesModalVisible(true)}>
                    查看我的漂流瓶
                  </Button>
                </Card>
                
                <Card className="bottle-rules-card" style={{ marginBottom: '30px' }}>
                  <Title level={4}>漂流瓶规则</Title>
                  <List
                    dataSource={[
                      '1. 漂流瓶内容完全匿名，不会显示任何用户信息',
                      '2. 每个漂流瓶只能被一个用户捡到',
                      '3. 捡到漂流瓶后可以给对方回复',
                      '4. 请文明用语，传递正能量',
                      '5. 漂流瓶内容会被系统自动过滤，请勿发送违规内容'
                    ]}
                    renderItem={item => <List.Item>{item}</List.Item>}
                  />
                </Card>
              </div>
            </div>
          )}

          {current === 'admin-users' && user && user.role === 'admin' && (
            <div className="admin-users-content">
              <Title level={2} style={{ marginBottom: '30px' }}>账号管理</Title>
              <Card>
                <div style={{ marginBottom: '20px' }}>
                  <Input.Search placeholder="搜索账号" style={{ width: '300px' }} />
                </div>
                <Table
                  columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: '用户名', dataIndex: 'username', key: 'username' },
                    { title: '姓名', dataIndex: 'name', key: 'name' },
                    { title: '角色', dataIndex: 'role', key: 'role' },
                    {
                      title: '操作',
                      key: 'action',
                      render: (_, record) => (
                        <Button
                          size="small"
                          danger
                          onClick={() => handleDeleteUser(record.id)}
                        >
                          删除
                        </Button>
                      )
                    }
                  ]}
                  dataSource={users.map(user => ({
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    role: user.role === 'student' ? '学生' : user.role === 'teacher' ? '陪伴者' : '管理员'
                  }))}
                  rowKey="id"
                />
              </Card>
            </div>
          )}
          {current === 'admin-appointments' && user && user.role === 'admin' && (
            <div className="admin-appointments-content">
              <Title level={2} style={{ marginBottom: '30px' }}>预约管理</Title>
              <Card>
                <div style={{ marginBottom: '20px' }}>
                  <Input.Search placeholder="搜索预约" style={{ width: '300px' }} />
                </div>
                <Table
                  columns={[
                    { title: '预约ID', dataIndex: 'id', key: 'id' },
                    { title: '学生姓名', dataIndex: 'student_name', key: 'student_name' },
                    { title: '陪伴者', dataIndex: 'teacher_name', key: 'teacher_name' },
                    { title: '预约时间', dataIndex: 'appointment_time', key: 'appointment_time' },
                    { title: '地点', dataIndex: 'location', key: 'location' },
                    { title: '状态', dataIndex: 'status', key: 'status' },
                    { 
                      title: '操作', 
                      key: 'action', 
                      render: (_, record) => (
                        <Button 
                          size="small" 
                          danger 
                          onClick={() => handleDeleteAdminAppointment(record.id)}
                        >
                          删除
                        </Button>
                      ) 
                    }
                  ]}
                  dataSource={adminAppointments}
                  rowKey="id"
                />
              </Card>
            </div>
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
      </Footer>

      {/* 陪伴者个人信息编辑模态框 */}
      <Modal
        title="编辑个人信息"
        open={isTeacherProfileModalVisible}
        onCancel={() => setIsTeacherProfileModalVisible(false)}
        footer={null}
      >
        <Form form={teacherProfileForm} onFinish={handleSaveTeacherProfile} layout="vertical">
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="professional_title" label="职称" rules={[{ required: true, message: '请输入职称' }]}>
            <Input placeholder="例如：数据结构教授、23届学长、计算机2401班导员" />
          </Form.Item>
          <Form.Item name="gender" label="性别">
            <Select placeholder="请选择性别">
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>
          <Form.Item name="available_time" label="可用时间" rules={[{ required: true, message: '请输入可用时间' }]}>
            <Input placeholder="例如：周一至周五 9:00-17:00" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 扔漂流瓶模态框 */}
      <Modal
        title="写一个漂流瓶"
        open={isBottleModalVisible}
        onCancel={() => {
          setIsBottleModalVisible(false);
          setBottleContent('');
        }}
        footer={null}
      >
        <div style={{ marginBottom: '20px' }}>
          <Text type="secondary">把你的烦恼、困惑或心情写进漂流瓶，它会飘向未知的远方</Text>
        </div>
        <TextArea
          rows={6}
          placeholder="请输入漂流瓶内容..."
          value={bottleContent}
          onChange={(e) => setBottleContent(e.target.value)}
          maxLength={500}
          style={{ marginBottom: '10px' }}
        />
        <Text type="secondary" style={{ float: 'right' }}>{bottleContent.length}/500</Text>
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <Button type="primary" onClick={handleThrowBottle} style={{ marginRight: '10px' }}>
            扔出漂流瓶
          </Button>
          <Button onClick={() => {
            setIsBottleModalVisible(false);
            setBottleContent('');
          }}>
            取消
          </Button>
        </div>
      </Modal>

      {/* 捡到漂流瓶模态框 */}
      <Modal
        title="捡到一个漂流瓶"
        open={isFoundBottleModalVisible}
        onCancel={() => {
          setIsFoundBottleModalVisible(false);
          setCurrentBottle(null);
          setBottleReply('');
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setIsFoundBottleModalVisible(false);
            setCurrentBottle(null);
            setBottleReply('');
          }}>
            关闭
          </Button>,
          <Button key="reply" type="primary" onClick={handleReplyBottle}>
            回复
          </Button>
        ]}
      >
        {currentBottle && (
          <div>
            <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '10px' }}>
                {new Date(currentBottle.createdAt).toLocaleString()}
              </Text>
              <Text>{currentBottle.content}</Text>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <Text>给对方一个温暖的回复：</Text>
            </div>
            <TextArea
              rows={4}
              placeholder="请输入回复内容..."
              value={bottleReply}
              onChange={(e) => setBottleReply(e.target.value)}
              maxLength={300}
              style={{ marginBottom: '10px' }}
            />
            <Text type="secondary" style={{ float: 'right' }}>{bottleReply.length}/300</Text>
          </div>
        )}
      </Modal>

      {/* 我的漂流瓶模态框 */}
      <Modal
        title="我的漂流瓶"
        open={isMyBottlesModalVisible}
        onCancel={() => setIsMyBottlesModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsMyBottlesModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        <List
          dataSource={user ? bottles.filter(bottle => bottle.createdBy === user.id) : []}
          renderItem={bottle => (
            <List.Item key={bottle.id}>
              <div style={{ width: '100%' }}>
                <div style={{ marginBottom: '10px' }}>
                  <Text strong>漂流瓶内容：</Text>
                  <Text style={{ marginLeft: '10px' }}>{bottle.content}</Text>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    扔出时间：{new Date(bottle.createdAt).toLocaleString()}
                  </Text>
                  <Tag color={bottle.hasBeenFound ? 'green' : 'orange'} style={{ marginLeft: '10px' }}>
                    {bottle.hasBeenFound ? '已被捡起' : '等待被捡起'}
                  </Tag>
                </div>
                {bottle.replies && bottle.replies.length > 0 && (
                  <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '10px' }}>
                      收到的回复（{bottle.replies.length}）：
                    </Text>
                    {bottle.replies.map((reply, index) => (
                      <div key={reply.id} style={{ marginBottom: index < bottle.replies.length - 1 ? '10px' : '0' }}>
                        <div style={{ padding: '10px', backgroundColor: '#e6f7ff', borderRadius: '8px' }}>
                          <Text>{reply.content}</Text>
                          <div style={{ marginTop: '5px' }}>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              回复时间：{new Date(reply.createdAt).toLocaleString()}
                            </Text>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {bottle.replies && bottle.replies.length === 0 && (
                  <div style={{ marginTop: '15px', color: '#999', fontSize: '14px' }}>
                    暂时还没有回复，期待有人捡到你的漂流瓶！
                  </div>
                )}
              </div>
            </List.Item>
          )}
          locale={{ emptyText: '你还没有扔出任何漂流瓶' }}
        />
      </Modal>

      {/* 登录模态框 */}
      <Modal
        title="登录"
        open={isLoginModalVisible}
        onCancel={() => setIsLoginModalVisible(false)}
        footer={null}
      >
        <Form form={loginForm} onFinish={handleLogin} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 注册模态框 */}
      <Modal
        title="注册"
        open={isRegisterModalVisible}
        onCancel={() => setIsRegisterModalVisible(false)}
        footer={null}
      >
        <Form form={registerForm} onFinish={handleRegister} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item name="phone" label="电话">
            <Input placeholder="请输入电话" />
          </Form.Item>
          <Form.Item name="school" label="学校" rules={[{ required: true, message: '请输入学校' }]}>
            <Input placeholder="请输入学校" />
          </Form.Item>
          <Form.Item name="gender" label="性别" rules={[{ required: true, message: '请选择性别' }]}>
            <Select placeholder="请选择性别">
              <Option value="male">男</Option>
              <Option value="female">女</Option>
            </Select>
          </Form.Item>

          <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select placeholder="请选择角色">
              <Option value="student">学生</Option>
              <Option value="teacher">陪伴者</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              注册
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 预约模态框 */}
      <Modal
        title={`预约 ${selectedTeacher?.name}`}
        open={isAppointmentModalVisible}
        onCancel={() => setIsAppointmentModalVisible(false)}
        footer={null}
      >
        <Form form={appointmentForm} onFinish={handleAppointment} layout="vertical">
          <Form.Item name="date" label="日期" rules={[{ required: true, message: '请选择日期' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="time" label="时间" rules={[{ required: true, message: '请选择时间' }]}>
            <TimePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="location" label="地点" rules={[{ required: true, message: '请输入地点' }]}>
            <Input placeholder="请输入地点" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              提交预约
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 反馈模态框 */}
      <Modal
        title="提交反馈"
        open={isFeedbackModalVisible}
        onCancel={() => setIsFeedbackModalVisible(false)}
        footer={null}
      >
        <Form form={feedbackForm} onFinish={handleFeedback} layout="vertical">
          <Form.Item name="appointment_id" label="预约ID" rules={[{ required: true, message: '请输入预约ID' }]}>
            <Input placeholder="请输入预约ID" disabled />
          </Form.Item>
          <Form.Item name="rating" label="评分" rules={[{ required: true, message: '请输入评分' }]}>
            <Input type="number" min={1} max={5} placeholder="请输入评分（1-5）" />
          </Form.Item>
          <Form.Item name="feedback" label="反馈内容" rules={[{ required: true, message: '请输入反馈内容' }]}>
            <TextArea rows={4} placeholder="请输入反馈内容" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              提交反馈
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 选择见面方式模态框 */}
      <Modal
        title="选择见面方式"
        open={isMeetingModeModalVisible}
        onCancel={() => {
          setIsMeetingModeModalVisible(false);
          setCurrentAppointmentForMeetingMode(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setIsMeetingModeModalVisible(false);
            setCurrentAppointmentForMeetingMode(null);
          }}>
            取消
          </Button>,
          <Button key="online" type="primary" onClick={() => handleSelectMeetingMode('online')}>
            线上匿名聊天
          </Button>,
          <Button key="offline" type="primary" onClick={() => handleSelectMeetingMode('offline')}>
            线下见面
          </Button>
        ]}
        width={400}
      >
        <div style={{ padding: '20px 0' }}>
          <p style={{ marginBottom: '20px', lineHeight: '1.5' }}>请选择您希望的见面方式：</p>
          <div style={{ marginBottom: '15px', padding: '15px', border: '1px solid #e8e8e8', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '10px' }}>线上匿名聊天</h4>
            <p style={{ fontSize: '14px', color: '#666' }}>通过系统内置的聊天功能进行匿名交流，保护您的隐私。</p>
          </div>
          <div style={{ padding: '15px', border: '1px solid #e8e8e8', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '10px' }}>线下见面</h4>
            <p style={{ fontSize: '14px', color: '#666' }}>在校园内的指定地点（如咖啡厅、会议室等）进行面对面交流。</p>
          </div>
        </div>
      </Modal>

      {/* 聊天模态框 */}
      <Modal
        title="线上匿名聊天"
        open={isChatModalVisible}
        onCancel={() => {
          setIsChatModalVisible(false);
          setChatMessages([]);
          setCurrentChatAppointment(null);
        }}
        footer={null}
        width={500}
      >
        <div style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          {/* 消息列表 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '10px' }}>
            {chatMessages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
                <p>开始匿名聊天吧</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.isMe ? 'flex-end' : 'flex-start',
                    marginBottom: '15px',
                    padding: '0 10px'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: msg.isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      backgroundColor: msg.isMe ? '#1890ff' : '#ffffff',
                      color: msg.isMe ? '#ffffff' : '#333333',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      position: 'relative'
                    }}
                  >
                    {!msg.isMe && (
                      <div style={{
                        position: 'absolute',
                        left: '-8px',
                        top: '10px',
                        width: '0',
                        height: '0',
                        borderTop: '8px solid transparent',
                        borderRight: '8px solid #ffffff',
                        borderBottom: '8px solid transparent'
                      }} />
                    )}
                    {msg.isMe && (
                      <div style={{
                        position: 'absolute',
                        right: '-8px',
                        top: '10px',
                        width: '0',
                        height: '0',
                        borderTop: '8px solid transparent',
                        borderLeft: '8px solid #1890ff',
                        borderBottom: '8px solid transparent'
                      }} />
                    )}
                    <div style={{ fontSize: '12px', marginBottom: '6px', opacity: 0.8, textAlign: msg.isMe ? 'right' : 'left' }}>
                      {msg.timestamp}
                    </div>
                    <div style={{ lineHeight: '1.5' }}>{msg.content}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* 输入框 */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <Input
              placeholder="输入消息..."
              style={{ flex: 1 }}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onPressEnter={handleSendMessage}
            />
            <Button type="primary" onClick={handleSendMessage}>
              发送
            </Button>
          </div>
        </div>
      </Modal>

    </Layout>
  );
}

export default App;
