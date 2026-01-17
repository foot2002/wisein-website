import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { to, name, inquiryMessage, replyMessage } = await request.json();

    if (!to || !name || !inquiryMessage || !replyMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

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

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'wic@wiseinc.co.kr',
      to: to,
      subject: '와이즈인컴퍼니입니다(문의 답변)',
      text: emailText,
      html: emailHTML,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
