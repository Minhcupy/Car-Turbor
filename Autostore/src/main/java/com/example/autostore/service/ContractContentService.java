package com.example.autostore.service;

import com.example.autostore.dto.admin.BookingPointDTO;
import com.example.autostore.dto.admin.DashboardReportDTO;
import com.example.autostore.model.Booking;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
    body { font-family: DejaVuSans, Arial, sans-serif; font-size: 12px; line-height: 1.45; color: #111; }
    .center { text-align: center; }
    .title { font-size: 16px; font-weight: bold; margin-top: 8px; }
    .subtitle { font-weight: bold; margin-top: 2px; }
    .rule { margin: 10px 0 12px; border-top: 1px solid #000; }
    .section-title { font-weight: bold; margin: 10px 0 6px; }
    .row { margin: 4px 0; }
    table { width: 100%%; border-collapse: collapse; }
    td { vertical-align: top; padding: 2px 0; }
    .label { width: 180px; font-weight: bold; }
    .muted { color: #333; }
    .small { font-size: 11px; }
  </style>
</head>
<body>

  <div class="center subtitle">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
  <div class="center muted"><b>Độc lập - Tự do - Hạnh phúc</b></div>
  <div class="center" style="margin-top:6px;">———</div>

  <div class="center title">HỢP ĐỒNG THUÊ XE Ô TÔ</div>

  <div class="row"><b>Số hợp đồng / Mã booking:</b> %s</div>
  <div class="row"><b>Thời gian lập:</b> %s</div>
  <div class="row"><b>Địa điểm lập:</b> %s</div>

  <div class="row small muted">
    Căn cứ Bộ luật Dân sự hiện hành và trên cơ sở tự nguyện, hai bên thống nhất ký kết hợp đồng thuê xe với các điều khoản sau.
  </div>

  <div class="rule"></div>

  <div class="section-title">I. THÔNG TIN CÁC BÊN</div>

  <div class="section-title">1. BÊN A (BÊN CHO THUÊ)</div>
  <table>
    <tr><td class="label">Họ tên:</td><td>%s</td></tr>
    <tr><td class="label">Địa chỉ:</td><td>%s</td></tr>
    <tr><td class="label">SĐT:</td><td>%s</td></tr>
  </table>

  <div class="section-title" style="margin-top:8px;">2. BÊN B (BÊN THUÊ)</div>
  <table>
    <tr><td class="label">Họ tên:</td><td>%s</td></tr>
    <tr><td class="label">SĐT:</td><td>%s</td></tr>
    <tr><td class="label">Địa chỉ:</td><td>%s</td></tr>
    <tr><td class="label">CMND/CCCD:</td><td>%s</td></tr>
    <tr><td class="label">GPLX:</td><td>%s</td></tr>
  </table>

  <div class="rule"></div>

  <div class="section-title">II. ĐỐI TƯỢNG HỢP ĐỒNG &amp; THỜI GIAN THUÊ</div>
  <table>
    <tr><td class="label">Xe thuê:</td><td>%s</td></tr>
    <tr><td class="label">Thời gian nhận xe:</td><td>%s %s</td></tr>
    <tr><td class="label">Thời gian trả xe:</td><td>%s %s</td></tr>
    <tr><td class="label">Địa điểm nhận:</td><td>%s</td></tr>
    <tr><td class="label">Địa điểm trả:</td><td>%s</td></tr>
  </table>

  <div class="row small muted">
    Hai bên sẽ lập/đối chiếu biên bản bàn giao xe khi nhận và khi trả xe (tình trạng ngoại thất, nội thất, nhiên liệu, phụ kiện, giấy tờ xe).
  </div>

  <div class="rule"></div>

  <div class="section-title">III. GIÁ TRỊ HỢP ĐỒNG, ĐẶT CỌC &amp; THANH TOÁN</div>
  <table>
    <tr><td class="label">Tổng tiền thuê:</td><td>%s VNĐ</td></tr>
    <tr><td class="label">Tiền đặt cọc:</td><td>%s VNĐ</td></tr>
  </table>

  <div class="row">1. <b>Thanh toán:</b> Bên B thanh toán tiền thuê và đặt cọc trước khi nhận xe (trừ khi có thỏa thuận khác bằng văn bản/tin nhắn xác nhận).</div>
  <div class="row">2. <b>Hoàn cọc:</b> Tiền đặt cọc được hoàn trả sau khi Bên B trả xe đúng thời gian, đúng địa điểm, đúng tình trạng, không phát sinh nghĩa vụ bồi thường/chi phí.</div>
  <div class="row">3. <b>Khấu trừ:</b> Bên A có quyền khấu trừ từ tiền đặt cọc các khoản: hư hỏng do lỗi Bên B, vệ sinh đặc biệt, vi phạm hợp đồng, phí phạt nguội phát sinh trong thời gian thuê (khi có bằng chứng/biên bản/Thông báo cơ quan chức năng).</div>

  <div class="rule"></div>

  <div class="section-title">IV. QUYỀN VÀ NGHĨA VỤ CỦA BÊN A</div>
  <div class="row">1. Giao xe đúng loại, đúng thời điểm, kèm giấy tờ xe hợp lệ theo quy định.</div>
  <div class="row">2. Hướng dẫn Bên B về tình trạng xe, phụ kiện, nhiên liệu và các lưu ý vận hành cơ bản (nếu cần).</div>
  <div class="row">3. Có quyền từ chối giao xe nếu Bên B không cung cấp đủ giấy tờ hợp lệ hoặc có dấu hiệu sử dụng xe trái pháp luật.</div>
  <div class="row">4. Hỗ trợ xử lý sự cố kỹ thuật không do lỗi sử dụng của Bên B (nếu phát sinh).</div>

  <div class="section-title">V. QUYỀN VÀ NGHĨA VỤ CỦA BÊN B</div>
  <div class="row">1. Cung cấp đầy đủ giấy tờ hợp lệ (CCCD/GPLX) khi nhận xe; chịu trách nhiệm về tính chính xác của thông tin đã cung cấp.</div>
  <div class="row">2. Sử dụng xe đúng mục đích, đúng luật giao thông; <b>không</b> dùng xe để cầm cố/thế chấp, chở hàng cấm, đua xe, hoặc bất kỳ hành vi trái pháp luật.</div>
  <div class="row">3. Không tự ý sửa chữa/thay đổi kết cấu xe. Khi cần sửa chữa phải thông báo và được Bên A đồng ý.</div>
  <div class="row">4. Chịu mọi chi phí phát sinh trong thời gian thuê: phí cầu đường, bãi đỗ, nhiên liệu, và các vi phạm giao thông.</div>
  <div class="row">5. Bảo quản xe, không giao xe cho người khác điều khiển khi không đủ điều kiện hoặc không được Bên A chấp thuận.</div>
  <div class="row">6. Trả xe đúng thời gian/địa điểm. Trường hợp trả trễ phải thông báo trước; có thể phát sinh phụ phí theo thỏa thuận/chính sách của Bên A.</div>

  <div class="rule"></div>

  <div class="section-title">VI. TRÁCH NHIỆM DO VI PHẠM, HƯ HỎNG, TAI NẠN</div>
  <div class="row">1. <b>Hư hỏng/mất mát:</b> Nếu xe/thiết bị/phụ kiện bị hư hỏng, mất mát do lỗi Bên B, Bên B chịu chi phí khắc phục/đền bù theo mức độ thiệt hại thực tế.</div>
  <div class="row">2. <b>Tai nạn:</b> Khi xảy ra tai nạn/sự cố nghiêm trọng, Bên B phải giữ nguyên hiện trường (nếu cần), báo cơ quan chức năng và thông báo ngay cho Bên A để phối hợp xử lý.</div>
  <div class="row">3. <b>Phạt nguội:</b> Các thông báo xử phạt liên quan thời gian thuê xe do Bên B chịu trách nhiệm thanh toán. Bên A có quyền cung cấp thông tin cần thiết theo yêu cầu của cơ quan chức năng.</div>

  <div class="rule"></div>

  <div class="section-title">VII. HỦY/ĐỔI LỊCH, CHẤM DỨT HỢP ĐỒNG</div>
  <div class="row">1. Trường hợp Bên B hủy thuê hoặc không nhận xe đúng giờ mà không thông báo hợp lý, Bên A có quyền giữ một phần/ toàn bộ tiền cọc tùy mức độ thiệt hại thực tế.</div>
  <div class="row">2. Một bên có quyền chấm dứt hợp đồng nếu bên kia vi phạm nghiêm trọng nghĩa vụ; các khoản chi phí phát sinh sẽ được đối soát khi chấm dứt.</div>
  <div class="row">3. Nếu Bên A không thể giao xe do lỗi của Bên A, Bên A hoàn lại các khoản Bên B đã thanh toán (nếu có) và hai bên thương lượng phương án thay thế (nếu phù hợp).</div>

  <div class="rule"></div>

  <div class="section-title">VIII. BẤT KHẢ KHÁNG</div>
  <div class="row">Bất khả kháng gồm: thiên tai, dịch bệnh, hỏa hoạn, chiến tranh, quyết định của cơ quan nhà nước, hoặc sự kiện khách quan khác khiến một bên không thể thực hiện nghĩa vụ. Bên gặp sự kiện bất khả kháng phải thông báo sớm và cung cấp bằng chứng hợp lệ; hai bên sẽ thương lượng phương án xử lý phù hợp.</div>

  <div class="rule"></div>

  <div class="section-title">IX. GIẢI QUYẾT TRANH CHẤP &amp; HIỆU LỰC</div>
  <div class="row">1. Hai bên ưu tiên giải quyết bằng thương lượng/hòa giải trên tinh thần hợp tác.</div>
  <div class="row">2. Nếu không đạt thỏa thuận, tranh chấp được đưa ra cơ quan có thẩm quyền giải quyết theo pháp luật Việt Nam.</div>
  <div class="row">3. Hợp đồng có hiệu lực kể từ thời điểm ký và được lập thành 02 bản (hoặc bản điện tử), mỗi bên giữ 01 bản có giá trị pháp lý như nhau.</div>

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

                // chữ ký hiển thị tên
                LESSOR_NAME,
                safe(b.getCustomer().getCustomerName())
        );
    }

    public String buildReportHtml(DashboardReportDTO r,
                                  LocalDate startDate,
                                  LocalDate endDate,
                                  String brand,
                                  String carType) {

        String brandText = (brand == null || brand.isBlank()) ? "Tất cả" : brand;
        String typeText  = (carType == null || carType.isBlank()) ? "Tất cả" : carType;

        long totalBookings = r.getDailyBookings().stream()
                .filter(x -> x.getBookings() != null)
                .mapToLong(BookingPointDTO::getBookings)
                .sum();

        long maxBookings = r.getDailyBookings().stream()
                .filter(x -> x.getBookings() != null)
                .mapToLong(BookingPointDTO::getBookings)
                .max()
                .orElse(0);

        double totalRevenue = r.getMonthlyRevenue().stream()
                .mapToDouble(x -> x.getRevenue() == null ? 0.0 : x.getRevenue())
                .sum();

        // ===== Revenue table rows =====
        String revenueRows = r.getMonthlyRevenue().stream()
                .map(x -> """
                <tr>
                  <td>%s</td>
                  <td class="right">%s đ</td>
                </tr>
            """.formatted(
                        safe(x.getMonth()),
                        String.format("%,.0f", x.getRevenue() == null ? 0.0 : x.getRevenue())
                ))
                .reduce("", (a, b) -> a + b);

        boolean hasRevenue = r.getMonthlyRevenue() != null && !r.getMonthlyRevenue().isEmpty();

        String revenueSection = hasRevenue
                ? """
              <div class="section-title">1. Doanh thu theo tháng</div>
              <table class="table">
                <thead>
                  <tr>
                    <th>Tháng</th>
                    <th class="right">Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  %s
                </tbody>
              </table>
            """.formatted(revenueRows)
                : """
              <div class="section-title">1. Doanh thu theo tháng</div>
              <div class="note">Không có dữ liệu doanh thu trong khoảng thời gian đã chọn.</div>
            """;

        // ===== Bookings rows: ONLY bookings > 0 =====
        String bookingRows = r.getDailyBookings().stream()
                .filter(x -> x.getBookings() != null && x.getBookings() > 0)
                .map(x -> """
                <tr>
                  <td>%s</td>
                  <td class="right">%d</td>
                </tr>
            """.formatted(safe(x.getDay()), x.getBookings()))
                .reduce("", (a, b) -> a + b);

        boolean hasBookings = r.getDailyBookings().stream()
                .anyMatch(x -> x.getBookings() != null && x.getBookings() > 0);

        String bookingsSection = hasBookings
                ? """
              <div class="section-title">2. Booking theo ngày (chỉ ngày có phát sinh)</div>
              <table class="table">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th class="right">Số booking</th>
                  </tr>
                </thead>
                <tbody>
                  %s
                </tbody>
              </table>
              <div class="note">Ghi chú: Bảng chỉ hiển thị các ngày có booking &gt; 0.</div>
            """.formatted(bookingRows)
                : """
              <div class="section-title">2. Booking theo ngày</div>
              <div class="note">Không có booking trong khoảng thời gian đã chọn.</div>
            """;

        String reportCode = "RPT-" + startDate + "-" + endDate;

        return """
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <style>
    @page {
      size: A4;
      margin: 14mm 14mm 16mm 14mm;

      @bottom-left {
        content: "CarTurbo - Dashboard Report";
        font-size: 10px;
        color: #666;
      }
      @bottom-right {
        content: "Trang " counter(page) "/" counter(pages);
        font-size: 10px;
        color: #666;
      }
    }

    body {
      font-family: DejaVu Sans, Arial, sans-serif;
      font-size: 12px;
      color: #111;
      line-height: 1.45;
    }

    .header {
      border-bottom: 2px solid #111;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }

    .brand {
      font-size: 18px;
      font-weight: 700;
      margin: 0;
    }

    .sub {
      color: #444;
      margin-top: 2px;
      font-size: 11px;
    }

    .meta {
      margin-top: 10px;
      padding: 10px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      background: #fafafa;
    }

    .meta-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      font-size: 11px;
      color: #333;
    }

    .meta-item {
      min-width: 180px;
    }

    .label {
      color: #666;
    }

    .kpi-grid {
      margin-top: 12px;
      display: flex;
      gap: 10px;
    }

    .kpi {
      flex: 1;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 10px;
      background: #fff;
    }

    .kpi .k {
      color: #666;
      font-size: 11px;
    }

    .kpi .v {
      font-size: 20px;
      font-weight: 700;
      margin-top: 4px;
    }

    .section-title {
      margin-top: 14px;
      font-weight: 700;
      font-size: 13px;
    }

    .table {
      width: 100%%;
      border-collapse: collapse;
      margin-top: 8px;
      border: 1px solid #e5e7eb;
    }

    .table th {
      background: #f3f4f6;
      text-align: left;
      padding: 8px 10px;
      font-size: 11px;
      border-bottom: 1px solid #e5e7eb;
    }

    .table td {
      padding: 8px 10px;
      border-bottom: 1px solid #eee;
      vertical-align: top;
    }

    .right { text-align: right; }

    .note {
      margin-top: 6px;
      font-size: 11px;
      color: #666;
      font-style: italic;
    }

    .signature {
      margin-top: 26px;
      display: flex;
      gap: 20px;
    }

    .sign-box {
      flex: 1;
      text-align: center;
      border-top: 1px dashed #bbb;
      padding-top: 10px;
      color: #333;
      min-height: 120px;
    }

    .sign-title {
      font-weight: 700;
      margin-bottom: 4px;
    }

    .sign-note {
      font-size: 11px;
      color: #666;
    }
  </style>
</head>

<body>

  <div class="header">
    <div class="brand">BÁO CÁO TỔNG HỢP DASHBOARD</div>
    <div class="sub">Hệ thống quản trị CarTurbo</div>

    <div class="meta">
      <div class="meta-row">
        <div class="meta-item"><span class="label">Mã báo cáo:</span> %s</div>
        <div class="meta-item"><span class="label">Thời gian:</span> %s → %s</div>
        <div class="meta-item"><span class="label">Brand:</span> %s</div>
        <div class="meta-item"><span class="label">Car type:</span> %s</div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi">
        <div class="k">Tổng doanh thu</div>
        <div class="v">%s đ</div>
      </div>
      <div class="kpi">
        <div class="k">Tổng booking</div>
        <div class="v">%d</div>
      </div>
      <div class="kpi">
        <div class="k">Max booking/ngày</div>
        <div class="v">%d</div>
      </div>
      <div class="kpi">
        <div class="k">Số điểm doanh thu</div>
        <div class="v">%d</div>
      </div>
    </div>
  </div>

  %s
  %s

</body>
</html>
""".formatted(
                reportCode,
                startDate, endDate, brandText, typeText,
                String.format("%,.0f", totalRevenue),
                totalBookings,
                maxBookings,
                r.getMonthlyRevenue() == null ? 0 : r.getMonthlyRevenue().size(),
                revenueSection,
                bookingsSection
        );
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}
