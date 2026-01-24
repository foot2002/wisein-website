// ============================================
// CRITICAL: First line must execute immediately
// ============================================
console.log('SERVER FILE EXECUTED');

// ============================================
// STEP 1: Load environment variables FIRST
// ============================================
console.log('Loading environment variables...');

const path = require('path');
const fs = require('fs');

console.log('   Current directory:', process.cwd());
console.log('   __dirname:', __dirname);

// Try multiple .env file locations (prioritize server/.env)
const envPaths = [
  path.join(__dirname, '.env'),      // Server directory (PRIORITY)
  path.join(__dirname, '..', '.env'), // Project root
  path.resolve(process.cwd(), '.env'), // Current working directory
];

let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`   Found .env at: ${envPath}`);
    require('dotenv').config({ path: envPath });
    envLoaded = true;
    break;
  } else {
    console.log(`   Not found: ${envPath}`);
  }
}

if (!envLoaded) {
  console.warn('   No .env file found, attempting default load...');
  require('dotenv').config(); // Fallback to default dotenv behavior
}

// ============================================
// STEP 2: Force-visible runtime debugging
// ============================================
console.log('Environment variables check:');
console.log('  SMTP_HOST:', process.env.SMTP_HOST || 'MISSING');
console.log('  SMTP_USER:', process.env.SMTP_USER || 'MISSING');
console.log('  SMTP_PASS:', process.env.SMTP_PASS ? 'SET (hidden)' : 'MISSING');
console.log('  SMTP_PORT:', process.env.SMTP_PORT || '587 (default)');
console.log('  SMTP_FROM:', process.env.SMTP_FROM || 'wic@wiseinc.co.kr (default)');
console.log('  PORT:', process.env.PORT || '3001 (default)');

// Process event handlers to catch silent exits
process.on('exit', (code) => {
  console.log(`Process exiting with code: ${code}`);
});

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

// ============================================
// STEP 3: Fail-fast environment validation
// ============================================
const requiredEnvVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('CRITICAL: Missing required environment variables:', missingVars.join(', '));
  console.error('Please check your server/.env file');
  console.error('Server will not start without these variables.');
  process.exit(1);
}

console.log('All required environment variables are present');

// ============================================
// STEP 4: Load dependencies (CommonJS only)
// ============================================
console.log('Loading dependencies...');

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

console.log('Dependencies loaded');

// ============================================
// STEP 5: Initialize Express app
// ============================================
console.log('Initializing Express app...');

const app = express();
app.use(cors());
app.use(express.json());

console.log('Express app initialized');

// ============================================
// STEP 6: SMTP Transporter configuration
// ============================================
console.log('Configuring SMTP transporter...');

const smtpPort = parseInt(process.env.SMTP_PORT || '587');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465, // true only for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Required for Worksmobile SMTP compatibility
  },
});

console.log('SMTP transporter configured:', {
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  user: process.env.SMTP_USER,
  tlsRejectUnauthorized: false
});

// ============================================
// STEP 7: Verify SMTP connection (non-blocking)
// ============================================
console.log('Verifying SMTP connection...');

transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP verification error:', error.message);
    console.error('   Code:', error.code);
    console.error('   Command:', error.command);
    console.warn('Server will continue, but email sending may fail');
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// ============================================
// STEP 8: API Routes
// ============================================
console.log('Setting up API routes...');

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'ok',
    smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
    timestamp: new Date().toISOString()
  });
});

// Email sending API route
app.post('/api/send-email', async (req, res) => {
  console.log('Email send request received');
  console.log('   Request body keys:', Object.keys(req.body));
  
  try {
    const { to, name, inquiryMessage, replyMessage } = req.body;

    console.log('   To:', to);
    console.log('   Name:', name);
    console.log('   Has inquiry message:', !!inquiryMessage);
    console.log('   Has reply message:', !!replyMessage);

    // Validate required fields
    if (!to || !name || !inquiryMessage || !replyMessage) {
      const missing = [];
      if (!to) missing.push('to');
      if (!name) missing.push('name');
      if (!inquiryMessage) missing.push('inquiryMessage');
      if (!replyMessage) missing.push('replyMessage');
      
      console.error('Missing required fields:', missing.join(', '));
      return res.status(400).json({ 
        error: 'Missing required fields',
        missing: missing
      });
    }

    // Check SMTP configuration (redundant check, but safe)
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP configuration missing during request');
      return res.status(500).json({ 
        error: 'SMTP 서버 설정이 완료되지 않았습니다. .env 파일을 확인하세요.',
        details: 'SMTP_HOST, SMTP_USER, SMTP_PASS 환경 변수가 필요합니다.'
      });
    }

    // Generate email text (plain text version)
    const emailText = `안녕하세요 ${name}님, 와이즈인컴퍼니의 서비스에 대한 문의를 주셔서 감사합니다.

귀하는 아래와 같은 문의를 주셨습니다:

[문의 내용]
${inquiryMessage}

저희가 검토한 결과 문의에 대한 답변은 다음과 같습니다:

[답변]
${replyMessage}

더 궁금한 사항이 있으시면 언제든 연락주시기 바랍니다.

항상 최선을 다하는 와이즈인컴퍼니가 되겠습니다.

WiseIN Company
데이터와 AI로 여는 비즈니스의 세계
서울시 강남구 역삼로309 기성빌딩3층
www.wiseinc.co.kr
02-558-5144
02-558-5146
wic@wiseinc.co.kr`;

    // Generate email HTML (HTML version)
    const emailHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .email-container {
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
    }
    p {
      margin: 15px 0;
    }
    hr {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 20px 0;
    }
    .section-label {
      font-weight: bold;
      color: #0066cc;
      margin: 20px 0 10px 0;
      display: block;
    }
    .message-block {
      background-color: #f9f9f9;
      padding: 15px;
      border-left: 4px solid #0066cc;
      margin: 10px 0 20px 0;
      white-space: pre-wrap;
      font-family: inherit;
      line-height: 1.6;
    }
    .signature {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 14px;
      line-height: 1.8;
    }
    .signature strong {
      display: block;
      margin-bottom: 10px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <p>안녕하세요 ${name}님, 와이즈인컴퍼니의 서비스에 대한 문의를 주셔서 감사합니다.</p>
    
    <p>귀하는 아래와 같은 문의를 주셨습니다:</p>
    
    <hr />
    
    <strong class="section-label">[문의 내용]</strong>
    <div class="message-block">${inquiryMessage}</div>
    
    <hr />
    
    <p>저희가 검토한 결과 문의에 대한 답변은 다음과 같습니다:</p>
    
    <strong class="section-label">[답변]</strong>
    <div class="message-block">${replyMessage}</div>
    
    <hr />
    
    <p>더 궁금한 사항이 있으시면 언제든 연락주시기 바랍니다.</p>
    
    <p>항상 최선을 다하는 와이즈인컴퍼니가 되겠습니다.</p>
    
    <div class="signature">
      <strong>WiseIN Company</strong>
      데이터와 AI로 여는 비즈니스의 세계<br />
      서울시 강남구 역삼로309 기성빌딩3층<br />
      www.wiseinc.co.kr<br />
      02-558-5144<br />
      02-558-5146<br />
      wic@wiseinc.co.kr
    </div>
  </div>
</body>
</html>`;

    console.log('Attempting to send email...');
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'wic@wiseinc.co.kr',
      to: to,
      subject: '와이즈인컴퍼니입니다(문의 답변)',
      text: emailText,
      html: emailHTML,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    console.log('   Response:', info.response);

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
      errorDetails = `SMTP 서버(${process.env.SMTP_HOST}:${process.env.SMTP_PORT || 587})에 연결할 수 없습니다. 방화벽이나 네트워크 설정을 확인하세요.`;
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
      code: error.code || 'UNKNOWN'
    });
  }
});

console.log('API routes configured');

// ============================================
// STEP 9: Start server
// ============================================
const PORT = process.env.PORT || 3001;

console.log('Starting server...');
console.log(`   Port: ${PORT}`);
console.log(`   Health check: http://localhost:${PORT}/api/health`);
console.log(`   Email endpoint: http://localhost:${PORT}/api/send-email`);

app.listen(PORT, () => {
  console.log('============================================');
  console.log(`Server running on port ${PORT}`);
  console.log('Email server is ready to accept requests');
  console.log('============================================');
});

// Keep process alive - prevent silent exit
console.log('Server initialization complete');
console.log('Process will stay alive to handle requests');
