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
    // ============================================
    // STEP 1: Environment variable validation (CRITICAL)
    // ============================================
    console.log('Validating environment variables...');
    console.log('SMTP_HOST:', process.env.SMTP_HOST ? 'SET' : 'MISSING');
    console.log('SMTP_PORT:', process.env.SMTP_PORT || '587 (default)');
    console.log('SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'MISSING');
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'MISSING');
    console.log('SMTP_FROM:', process.env.SMTP_FROM || 'NOT SET');

    if (!process.env.SMTP_HOST) {
      console.error('CRITICAL: SMTP_HOST is missing');
      return res.status(500).json({ 
        error: 'SMTP_HOST is missing',
        message: 'SMTP_HOST environment variable is required'
      });
    }

    if (!process.env.SMTP_USER) {
      console.error('CRITICAL: SMTP_USER is missing');
      return res.status(500).json({ 
        error: 'SMTP_USER is missing',
        message: 'SMTP_USER environment variable is required'
      });
    }

    if (!process.env.SMTP_PASS) {
      console.error('CRITICAL: SMTP_PASS is missing');
      return res.status(500).json({ 
        error: 'SMTP_PASS is missing',
        message: 'SMTP_PASS environment variable is required'
      });
    }

    console.log('✅ All required environment variables are present');

    // ============================================
    // STEP 2: Validate request body
    // ============================================
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

    // ============================================
    // STEP 3: Configure SMTP transporter for Vercel
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
      // Timeout settings for Vercel
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000, // 10 seconds
      socketTimeout: 10000, // 10 seconds
    });

    console.log('SMTP transporter configured:', {
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      user: process.env.SMTP_USER,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // ============================================
    // STEP 4: Generate minimal email content (text-only)
    // ============================================
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

    // ============================================
    // STEP 5: Send email
    // ============================================
    console.log('Attempting to send email...');
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'wic@wiseinc.co.kr',
      to: to,
      subject: '와이즈인컴퍼니입니다(문의 답변)',
      text: emailText,
      // HTML removed for now to ensure SMTP success
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    console.log('   Response:', info.response);

    return res.status(200).json({ 
      success: true, 
      messageId: info.messageId 
    });
  } catch (error) {
    // ============================================
    // STEP 6: Error transparency
    // ============================================
    console.error('❌ Error sending email:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);

    // Return error.message AND error.code (if exists)
    let errorMessage = error.message || '이메일 전송에 실패했습니다.';
    let errorCode = error.code || 'UNKNOWN';
    let errorDetails = '';

    if (error.code === 'EAUTH') {
      errorMessage = 'SMTP 인증 실패';
      errorDetails = '이메일 주소와 비밀번호를 확인하세요. Worksmobile 사용 시 계정 정보를 확인하세요.';
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
      // Use the actual error message
      errorDetails = error.message || '알 수 없는 오류';
    }

    // Do NOT return empty objects - always return meaningful error information
    return res.status(500).json({ 
      error: errorMessage,
      message: error.message || errorMessage, // Include original error message
      code: errorCode,
      details: errorDetails,
      // Include additional error info for debugging
      ...(error.response && { response: error.response }),
      ...(error.responseCode && { responseCode: error.responseCode }),
    });
  }
};
