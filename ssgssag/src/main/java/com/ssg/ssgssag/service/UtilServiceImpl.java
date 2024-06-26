//package com.ssg.ssgssag.service;
//
//import com.ssg.ssgssag.dto.InventoryShortageDTO;
//import com.ssg.ssgssag.mapper.UtilMapper;
//import jakarta.mail.MessagingException;
//import jakarta.mail.internet.MimeMessage;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.log4j.Log4j2;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.MimeMessageHelper;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@Log4j2
//@RequiredArgsConstructor
//public class UtilServiceImpl implements UtilService {
//
//    @Autowired
//    private final UtilMapper utilMapper;
//
//    @Autowired
//    private JavaMailSender javaMailSender;
//
//
//    @Override
//    public void sendShortageNotificationEmails() {
//
//        // 1. 재고 부족 상품 목록 조회
//        List<InventoryShortageDTO> shortageProducts = utilMapper.findShortageInventory();
//
//        // 2. 메일 보낼 대상의 이메일 주소 조회
//        List<String> recipientEmails = utilMapper.selectMemberEmail();
//
//        // 3. 재고 부족 상품 목록을 이메일로 발송
//        String subject = "[SSGSSAG] 재고 부족 알림입니다.";
//        StringBuilder contentBuilder = new StringBuilder();
//
//        // HTML 테이블 시작 태그
//        contentBuilder.append("<table border='0'>");
//        // 테이블 헤더 추가
//        contentBuilder.append("<tr><th>번호</th><th>상품명</th><th>상품 코드</th><th>재고 수량</th><th>창고 코드</th></tr>");
//
//        int number = 1;
//
//        for (InventoryShortageDTO product : shortageProducts) {
//            String productName = product.getVProductNm();
//            String productCode = product.getVProductCd();
//            int inventoryCount = product.getTotalInventoryCount();
//            String warehouseCode = product.getVWarehouseCd();
//
//            // 테이블의 각 행 추가
//            contentBuilder.append("<tr>");
//            contentBuilder.append("<td>").append(number).append("</td>");
//            contentBuilder.append("<td>").append(productName).append("</td>");
//            contentBuilder.append("<td>").append(productCode).append("</td>");
//            contentBuilder.append("<td>").append(inventoryCount).append("</td>");
//            contentBuilder.append("<td>").append(warehouseCode).append("</td>");
//            contentBuilder.append("</tr>");
//
//            number++;
//        }
//
//// HTML 테이블 종료 태그
//        contentBuilder.append("</table>");
//
//        String content = contentBuilder.toString();
//        for (String recipientEmail : recipientEmails) {
//            try {
//                if (!shortageProducts.isEmpty()){
//                    sendEmail(recipientEmail, subject, content);
//                }
//            } catch (MessagingException e) {
//                e.printStackTrace();
//            }
//        }
//
//    }
//
//    @Override
//    public void sendResetPasswordLink(String email, String tempPassword) {
//        // 임시 비밀번호 발급 안내 메일의 내용을 생성합니다.
//        String subject = "[SSGSSAG] 임시 비밀번호 발급 안내 메일입니다.";
//        String resetPasswordUrl = "<a href=\"http://localhost:8090/login\">임시 비밀번호로 로그인해주세요.</a>";
//        String content = "임시 비밀번호가 발급되었습니다.<br>"+ tempPassword +"<br>다음 링크로 로그인해주세요.<br>"+ resetPasswordUrl;
//
//        // 이메일을 발송합니다.
//        try {
//            sendEmail(email, subject, content);
//        } catch (MessagingException e) {
//            throw new RuntimeException(e);
//        }
//
//    }
//
//    private void sendEmail(String recipientEmail, String subject, String content) throws MessagingException {
//        MimeMessage message = javaMailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(message, true);
//        helper.setTo(recipientEmail);
//        helper.setSubject(subject);
//        helper.setText(content, true);
//
//        javaMailSender.send(message); // 이메일 전송
//    }
//}
//
