// Email service for sending inquiry replies
// Note: In production, this should be handled by a backend API for security

export interface EmailData {
  to: string;
  name: string;
  inquiryMessage: string;
  replyMessage: string;
}

export async function sendInquiryReplyEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // Vite 프록시를 통해 같은 포트에서 API 호출
    const apiUrl = import.meta.env.VITE_EMAIL_API_URL || '/api/send-email';
    
    console.log('Sending email to:', apiUrl);
    console.log('Email data:', { to: data.to, name: data.name });
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: data.to,
        name: data.name,
        inquiryMessage: data.inquiryMessage,
        replyMessage: data.replyMessage,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Email API error:', errorData);
      
      let errorMessage = errorData.error || `서버 오류 (${response.status})`;
      
      // 상세 에러 정보가 있으면 추가
      if (errorData.details) {
        errorMessage += `\n${errorData.details}`;
      }
      
      // 네트워크 에러인 경우
      if (response.status === 0 || !response.status) {
        return { success: false, error: '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요. (npm run server)' };
      }
      
      return { success: false, error: errorMessage };
    }
    
    const result = await response.json();
    console.log('Email sent successfully:', result);
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    
    let errorMessage = '이메일 전송에 실패했습니다.';
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요. (npm run server)';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
}

// 텍스트 이메일 본문 생성
function generateEmailText(data: EmailData): string {
  return `안녕하세요 ${data.name}님, 와이즈인컴퍼니의 서비스에 대한 문의를 주셔서 감사합니다.

귀하는 아래와 같은 문의를 주셨습니다:
${data.inquiryMessage}

저희가 검토한 결과 문의에 대한 답변은 다음과 같습니다:
${data.replyMessage}

더 궁금한 사항이 있으시면 언제든 연락주시기 바랍니다.
항상 최선을 다하는 와이즈인컴퍼니가 되겠습니다.

---
데이터와 AI로 여는 비즈니스의 세계.
공공기관 및 기업을 위한 신뢰할 수 있는 데이터 & AI 파트너입니다.

서울시 강남구 역삼로309 기성빌딩3층
02-558-5144
02-558-5146
wic@wiseinc.co.kr`;
}

// HTML 이메일 템플릿 생성 함수 (백엔드에서 사용)
export function generateEmailHTML(data: EmailData): string {
  return `
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
    <p>안녕하세요 ${data.name}님, 와이즈인컴퍼니의 서비스에 대한 문의를 주셔서 감사합니다.</p>
    
    <p>귀하는 아래와 같은 문의를 주셨습니다:</p>
    <div class="inquiry-box">${data.inquiryMessage}</div>
    
    <p>저희가 검토한 결과 문의에 대한 답변은 다음과 같습니다:</p>
    <div class="reply-box">${data.replyMessage}</div>
    
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
}
