import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Validate environment variables
const requiredEnvVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  console.error('Please check your .env file');
}

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP configuration error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  });
});

// Email sending API route
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, name, inquiryMessage, replyMessage } = req.body;

    console.log('Received email request:', { to, name, hasMessage: !!inquiryMessage, hasReply: !!replyMessage });

    if (!to || !name || !inquiryMessage || !replyMessage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check SMTP configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP configuration missing');
      return res.status(500).json({ 
        error: 'SMTP 서버 설정이 완료되지 않았습니다. .env 파일을 확인하세요.',
        details: 'SMTP_HOST, SMTP_USER, SMTP_PASS 환경 변수가 필요합니다.'
      });
    }

    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 2px solid #0066cc;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #0066cc;
      margin-bottom: 10px;
    }
    .content {
      padding: 20px 0;
    }
    .inquiry-box, .reply-box {
      background-color: #f5f5f5;
      padding: 15px;
      border-left: 4px solid #0066cc;
      margin: 15px 0;
      white-space: pre-wrap;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .footer-info {
      margin-top: 15px;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">WiseIN Company</div>
    <div style="color: #666; font-size: 14px;">데이터와 AI로 여는 비즈니스의 세계.</div>
    <div style="color: #666; font-size: 12px; margin-top: 5px;">공공기관 및 기업을 위한 신뢰할 수 있는 데이터 & AI 파트너입니다.</div>
  </div>
  
  <div class="content">
    <p>안녕하세요 ${name}님, 와이즈인컴퍼니의 서비스에 대한 문의를 주셔서 감사합니다.</p>
    
    <p>귀하는 아래와 같은 문의를 주셨습니다:</p>
    <div class="inquiry-box">${inquiryMessage}</div>
    
    <p>저희가 검토한 결과 문의에 대한 답변은 다음과 같습니다:</p>
    <div class="reply-box">${replyMessage}</div>
    
    <p>더 궁금한 사항이 있으시면 언제든 연락주시기 바랍니다.<br>
    항상 최선을 다하는 와이즈인컴퍼니가 되겠습니다.</p>
  </div>
  
  <div class="footer">
    <div class="footer-info">
      <strong>WiseIN Company</strong><br>
      서울시 강남구 역삼로309 기성빌딩3층<br>
      02-558-5144<br>
      02-558-5146<br>
      wic@wiseinc.co.kr
    </div>
  </div>
</body>
</html>
    `;

    const emailText = `안녕하세요 ${name}님, 와이즈인컴퍼니의 서비스에 대한 문의를 주셔서 감사합니다.

귀하는 아래와 같은 문의를 주셨습니다:
${inquiryMessage}

저희가 검토한 결과 문의에 대한 답변은 다음과 같습니다:
${replyMessage}

더 궁금한 사항이 있으시면 언제든 연락주시기 바랍니다.
항상 최선을 다하는 와이즈인컴퍼니가 되겠습니다.

---
데이터와 AI로 여는 비즈니스의 세계.
공공기관 및 기업을 위한 신뢰할 수 있는 데이터 & AI 파트너입니다.

서울시 강남구 역삼로309 기성빌딩3층
02-558-5144
02-558-5146
wic@wiseinc.co.kr`;

    console.log('Attempting to send email...');
    const mailOptions = {
      from: process.env.SMTP_FROM || 'wic@wiseinc.co.kr',
      to: to,
      subject: '와이즈인컴퍼니입니다(문의 답변)',
      text: emailText,
      html: emailHTML,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    
    let errorMessage = '이메일 전송에 실패했습니다.';
    let errorDetails = '';

    if (error.code === 'EAUTH') {
      errorMessage = 'SMTP 인증 실패';
      errorDetails = '이메일 주소와 비밀번호를 확인하세요. Gmail 사용 시 앱 비밀번호를 사용해야 합니다.';
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      errorMessage = 'SMTP 서버에 연결할 수 없습니다';
      errorDetails = `SMTP 서버(${process.env.SMTP_HOST}:${process.env.SMTP_PORT})에 연결할 수 없습니다. 방화벽이나 네트워크 설정을 확인하세요.`;
    } else if (error.code === 'EENVELOPE') {
      errorMessage = '이메일 주소 형식 오류';
      errorDetails = '받는 사람 이메일 주소를 확인하세요.';
    } else if (error.response) {
      errorMessage = `SMTP 서버 오류: ${error.response}`;
      errorDetails = error.responseCode ? `응답 코드: ${error.responseCode}` : '';
    } else {
      errorDetails = error.message || '알 수 없는 오류';
    }

    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      message: error.message,
    });

    res.status(500).json({ 
      error: errorMessage,
      details: errorDetails,
      code: error.code
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
