package com.example.autostore.service;

import com.example.autostore.model.Booking;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ContractContentService {

    private static final ZoneId VN = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // ✅ Thông tin BÊN CHO THUÊ (Bên A) cố định
    private static final String LESSOR_NAME = "Trịnh Quang Minh";
    private static final String LESSOR_ADDR = "Phú Diễn, Hà Nội";
    private static final String LESSOR_PHONE = "09xxxxxxxx"; // <- bạn điền SĐT ở đây

    public String buildHtml(Booking b) {
        String today = ZonedDateTime.now(VN).format(DATE_FMT);
        String location = "Hà Nội";

        return """
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <style>
    @page { size: A4; margin: 18mm 16mm; }
    body { font-family: DejaVuSans, Arial, sans-serif; font-size: 12px; line-height: 1.4; color: #111; }
    .center { text-align: center; }
    .title { font-size: 16px; font-weight: bold; margin-top: 8px; }
    .subtitle { font-weight: bold; margin-top: 2px; }
    .rule { margin: 10px 0 12px; border-top: 1px solid #000; }
    .section-title { font-weight: bold; margin: 10px 0 6px; }
    .row { margin: 3px 0; }
    table { width: 100%%; border-collapse: collapse; }
    td { vertical-align: top; padding: 2px 0; }
    .label { width: 160px; font-weight: bold; }
    .muted { color: #333; }
  </style>
</head>
<body>

  <div class="center subtitle">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
  <div class="center muted"><b>Độc lập - Tự do - Hạnh phúc</b></div>
  <div class="center" style="margin-top:6px;">———</div>

  <div class="center title">HỢP ĐỒNG THUÊ XE</div>

  <div class="row"><b>Số hợp đồng / Mã booking:</b> %s</div>
  <div class="row"><b>Thời gian lập:</b> %s</div>
  <div class="row"><b>Địa điểm lập:</b> %s</div>

  <div class="rule"></div>

  <div class="section-title">I. THÔNG TIN CÁC BÊN</div>

  <div class="section-title">BÊN A (BÊN CHO THUÊ)</div>
  <table>
    <tr><td class="label">Họ tên:</td><td>%s</td></tr>
    <tr><td class="label">Địa chỉ:</td><td>%s</td></tr>
    <tr><td class="label">SĐT:</td><td>%s</td></tr>
  </table>

  <div class="section-title" style="margin-top:8px;">BÊN B (BÊN THUÊ)</div>
  <table>
    <tr><td class="label">Họ tên:</td><td>%s</td></tr>
    <tr><td class="label">SĐT:</td><td>%s</td></tr>
    <tr><td class="label">Địa chỉ:</td><td>%s</td></tr>
    <tr><td class="label">CMND/CCCD:</td><td>%s</td></tr>
    <tr><td class="label">GPLX:</td><td>%s</td></tr>
  </table>

  <div class="rule"></div>

  <div class="section-title">II. THÔNG TIN XE &amp; THỜI GIAN THUÊ</div>
  <table>
    <tr><td class="label">Xe thuê:</td><td>%s</td></tr>
    <tr><td class="label">Nhận xe:</td><td>%s %s</td></tr>
    <tr><td class="label">Trả xe:</td><td>%s %s</td></tr>
    <tr><td class="label">Địa điểm nhận:</td><td>%s</td></tr>
    <tr><td class="label">Địa điểm trả:</td><td>%s</td></tr>
  </table>

  <div class="rule"></div>

  <div class="section-title">III. GIÁ TRỊ HỢP ĐỒNG</div>
  <table>
    <tr><td class="label">Tổng tiền:</td><td>%s</td></tr>
    <tr><td class="label">Đặt cọc:</td><td>%s</td></tr>
  </table>

  <div class="rule"></div>

  <div class="section-title">IV. ĐIỀU KHOẢN</div>
  <div class="row">1. Bên B cung cấp đầy đủ giấy tờ hợp lệ (CCCD/GPLX) khi nhận xe.</div>
  <div class="row">2. Bên B thanh toán đặt cọc theo thỏa thuận. Khi hoàn trả xe đúng điều kiện sẽ được đối soát và hoàn cọc (nếu có).</div>
  <div class="row">3. Bên B chịu trách nhiệm các vi phạm giao thông, phí cầu đường, bãi xe phát sinh trong thời gian thuê.</div>
  <div class="row">4. Không tự ý sửa chữa/thay đổi kết cấu xe. Nếu hư hỏng do lỗi sử dụng, Bên B chịu chi phí.</div>
  <div class="row">5. Trả xe đúng thời gian/địa điểm. Trễ giờ có thể tính thêm phí theo chính sách của Bên A.</div>
  <div class="row">6. Hai bên đối chiếu tình trạng xe khi giao/nhận (ngoại thất, nội thất, nhiên liệu, phụ kiện).</div>
  <div class="row">7. Hợp đồng có hiệu lực kể từ thời điểm ký. Mọi tranh chấp ưu tiên thương lượng, nếu không được sẽ giải quyết theo pháp luật Việt Nam.</div>

  <table style="margin-top:26px;">
    <tr>
      <td class="center" style="width:50%%;">
        <b>ĐẠI DIỆN BÊN A</b><br/><span class="muted">(Ký, ghi rõ họ tên)</span><br/><br/><br/><br/>
        %s
      </td>
      <td class="center" style="width:50%%;">
        <b>ĐẠI DIỆN BÊN B</b><br/><span class="muted">(Ký, ghi rõ họ tên)</span><br/><br/><br/><br/>
        %s
      </td>
    </tr>
  </table>

</body>
</html>
        """.formatted(
                // Header
                b.getBookingId(),
                today,
                location,

                // Bên A
                LESSOR_NAME,
                LESSOR_ADDR,
                LESSOR_PHONE,

                // Bên B
                safe(b.getCustomer().getCustomerName()),
                safe(b.getCustomer().getCustomerPhone()),
                safe(b.getCustomer().getCustomerAddress()),
                safe(b.getCustomer().getId_number()),
                safe(b.getCustomer().getLicense_number()),

                // Xe + thời gian
                safe(b.getCar().getCarName()),
                b.getPickupDate(), b.getPickupTime(),
                b.getReturnDate(), b.getReturnTime(),
                safe(b.getPickupLocation()),
                safe(b.getReturnLocation()),

                // Giá trị
                String.valueOf(b.getTotalAmount()),
                String.valueOf(b.getDepositAmount()),

                // chữ ký hiển thị tên (tuỳ bạn)
                LESSOR_NAME,
                safe(b.getCustomer().getCustomerName())
        );
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}
