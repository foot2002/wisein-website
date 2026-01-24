const nodemailer = require('nodemailer');

/**
 * Vercel Serverless Function for sending inquiry reply emails
 * POST /api/send-email
 */
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    });
  }

  try {
    const { to, name, inquiryMessage, replyMessage } = req.body;

    console.log('Email send request received');
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

    // Check SMTP configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP configuration missing');
      return res.status(500).json({ 
        error: 'SMTP 서버 설정이 완료되지 않았습니다.',
        details: 'SMTP_HOST, SMTP_USER, SMTP_PASS 환경 변수가 필요합니다.'
      });
    }

    // Configure SMTP transporter
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

    return res.status(200).json({ 
      success: true, 
      messageId: info.messageId 
    });
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

    return res.status(500).json({ 
      error: errorMessage,
      details: errorDetails,
      code: error.code || 'UNKNOWN'
    });
  }
};
