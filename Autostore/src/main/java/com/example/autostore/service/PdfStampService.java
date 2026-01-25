package com.example.autostore.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfStampService {

    public byte[] stampSignature(byte[] pdfBytes, byte[] pngBytes, String signerName) {
        try (PDDocument doc = PDDocument.load(pdfBytes);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            var page = doc.getPage(doc.getNumberOfPages() - 1);
            var img = PDImageXObject.createFromByteArray(doc, pngBytes, "signature");

            float imgW = 170, imgH = 65;
            var box = page.getMediaBox();
            float x = box.getWidth() - imgW - 50;
            float y = 80;

            try (PDPageContentStream cs = new PDPageContentStream(
                    doc, page, PDPageContentStream.AppendMode.APPEND, true, true
            )) {
                cs.drawImage(img, x, y, imgW, imgH);

                cs.beginText();
                cs.setFont(PDType1Font.HELVETICA, 10);
                cs.newLineAtOffset(x, y - 12);
                cs.showText("Signed by: " + signerName);
                cs.endText();
            }

            doc.save(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Stamp signature failed", e);
        }
    }
}
