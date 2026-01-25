package com.example.autostore.service;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;

@Service
public class PdfRenderService {

    public byte[] renderFromHtml(String html) throws Exception {
        var regularRes = new ClassPathResource("fonts/DejaVuSans.ttf");
        var boldRes    = new ClassPathResource("fonts/DejaVuSans-Bold.ttf");

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(html, null);

            builder.useFont(() -> {
                try { return regularRes.getInputStream(); }
                catch (IOException e) { throw new UncheckedIOException(e); }
            }, "DejaVuSans", 400, PdfRendererBuilder.FontStyle.NORMAL, true);

            builder.useFont(() -> {
                try { return boldRes.getInputStream(); }
                catch (IOException e) { throw new UncheckedIOException(e); }
            }, "DejaVuSans", 700, PdfRendererBuilder.FontStyle.NORMAL, true);

            builder.toStream(out);
            builder.run();
            return out.toByteArray();
        }
    }
}
