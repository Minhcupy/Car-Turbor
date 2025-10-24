package com.example.autostore.service;

import com.example.autostore.Enum.CarStatus;
import com.example.autostore.dto.CarDTO;
import com.example.autostore.dto.ChatbotResponseDTO;
import com.example.autostore.model.Car;
import com.example.autostore.repository.CarDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final CarDataRepository carRepo;
    private final GeminiService geminiService;

    @Value("${chatbot.hotline}")
    private String hotline;

    public ChatbotResponseDTO answer(String question) {
        List<Car> cars = carRepo.findAvailableCars(CarStatus.AVAILABLE, null, null);

        if (cars.isEmpty()) {
            return new ChatbotResponseDTO(
                    "Hiện tại chưa có xe nào phù hợp 🙏. Bạn vui lòng liên hệ hotline " + hotline + " để được hỗ trợ nhanh nhất.",
                    List.of()
            );
        }

        List<CarDTO> carDtos = cars.stream().limit(3).map(c ->
                new CarDTO(
                        c.getBrand().getBrandName(),
                        c.getCarName(),
                        c.getCarType().getTypeName(),
                        c.getCarDetail().getSeatCount(),
                        c.getImageUrl()
                )
        ).toList();

        StringBuilder info = new StringBuilder("Danh sách xe hiện có:\n");
        for (CarDTO dto : carDtos) {
            info.append("- ")
                    .append(dto.getBrand()).append(" ").append(dto.getName())
                    .append(" (").append(dto.getSeatCount()).append(" chỗ, ")
                    .append(dto.getType()).append(")\n");
        }

        String prompt = """
        Bạn là trợ lý tư vấn thuê xe Carbook.
        Trả lời thân thiện, ngắn gọn, tự nhiên.
        Nếu không chắc chắn thì hãy khuyến khích khách liên hệ hotline %s.
        
        Dữ liệu xe hiện có:
        %s
        
        Câu hỏi của khách: %s
        """.formatted(hotline, info, question);

        String answerText = geminiService.generateAnswer(prompt);

        // 🔹 xử lý nhiều trường hợp
        if (answerText == null || answerText.isBlank()) {
            answerText = "Mình chưa có thông tin chính xác 🙏. Vui lòng liên hệ hotline " + hotline + " để được hỗ trợ.";
        } else {
            String lower = answerText.toLowerCase();

            if (lower.contains("không có dữ liệu") || lower.contains("không thể trả lời") ||
                    lower.contains("tôi không có") || lower.contains("xin lỗi") || lower.contains("ai ngôn ngữ")) {
                answerText = "Hiện tại mình chưa rõ thông tin bạn cần 🤔. Bạn có thể tham khảo các xe khả dụng hoặc liên hệ hotline " + hotline + " để được tư vấn thêm.";
            }

            // nếu câu trả lời quá dài thì cắt gọn
            if (answerText.length() > 400) {
                answerText = answerText.substring(0, 380) + "... " +
                        "Để biết thêm chi tiết, hãy gọi hotline " + hotline + ".";
            }
        }

        return new ChatbotResponseDTO(answerText, carDtos);
    }
}
