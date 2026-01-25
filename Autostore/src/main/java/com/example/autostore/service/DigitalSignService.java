package com.example.autostore.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.interactive.digitalsignature.PDSignature;
import org.apache.pdfbox.pdmodel.interactive.digitalsignature.SignatureInterface;
import org.apache.pdfbox.pdmodel.interactive.digitalsignature.SignatureOptions;
import org.bouncycastle.asn1.ASN1ObjectIdentifier;
import org.bouncycastle.asn1.pkcs.PKCSObjectIdentifiers;
import org.bouncycastle.cert.jcajce.JcaCertStore;
import org.bouncycastle.cms.*;
import org.bouncycastle.cms.jcajce.JcaSignerInfoGeneratorBuilder;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.DigestCalculatorProvider;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.util.*;

@Service
public class DigitalSignService {

    @Value("${app.signing.keystore-path}")
    private String keystorePath;

    @Value("${app.signing.keystore-password}")
    private String keystorePassword;

    @Value("${app.signing.key-alias}")
    private String keyAlias;

    @Value("${app.signing.reason:AutoStore Demo}")
    private String reason;

    @Value("${app.signing.location:VN}")
    private String location;

    public static class SignResult {
        public final byte[] signedPdf;
        public final String certSubject;
        public SignResult(byte[] signedPdf, String certSubject) {
            this.signedPdf = signedPdf;
            this.certSubject = certSubject;
        }
    }

    public SignResult signPdf(byte[] pdfBytes) {
        try {
            // 1) load keystore
            KeyStore ks = KeyStore.getInstance("PKCS12");
            System.out.println("WORKDIR=" + System.getProperty("user.dir"));
            System.out.println("KEYSTORE_EXISTS=" + new java.io.File("./keys/keystore.p12").exists());
            try (InputStream is = new FileInputStream(keystorePath)) {
                ks.load(is, keystorePassword.toCharArray());
            }

            PrivateKey privateKey = (PrivateKey) ks.getKey(keyAlias, keystorePassword.toCharArray());
            Certificate[] chain = ks.getCertificateChain(keyAlias);

            if (privateKey == null || chain == null || chain.length == 0) {
                throw new IllegalStateException("Missing key/chain for alias: " + keyAlias);
            }

            X509Certificate signingCert = (X509Certificate) chain[0];
            String subject = signingCert.getSubjectX500Principal().getName();

            // 2) sign pdf
            try (PDDocument doc = PDDocument.load(pdfBytes);
                 ByteArrayOutputStream output = new ByteArrayOutputStream()) {

                PDSignature signature = new PDSignature();
                signature.setFilter(PDSignature.FILTER_ADOBE_PPKLITE);
                signature.setSubFilter(PDSignature.SUBFILTER_ETSI_CADES_DETACHED);
                signature.setName("AutoStore Demo Signer");
                signature.setLocation(location);
                signature.setReason(reason);
                signature.setSignDate(Calendar.getInstance());

                SignatureOptions options = new SignatureOptions();
                options.setPreferredSignatureSize(SignatureOptions.DEFAULT_SIGNATURE_SIZE * 2);

                SignatureInterface signatureInterface = content ->
                {
                    try {
                        return createDetachedCMS(content, privateKey, chain);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                };

                doc.addSignature(signature, signatureInterface, options);
                doc.saveIncremental(output);

                return new SignResult(output.toByteArray(), subject);
            }

        } catch (Exception e) {
            throw new RuntimeException("Digital sign PDF failed", e);
        }
    }

    private byte[] createDetachedCMS(InputStream content, PrivateKey privateKey, Certificate[] chain) throws Exception {
        List<X509Certificate> certList = new ArrayList<>();
        for (Certificate c : chain) certList.add((X509Certificate) c);

        JcaCertStore certStore = new JcaCertStore(certList);

        ContentSigner contentSigner = new JcaContentSignerBuilder("SHA256withRSA")
                .setProvider("BC")
                .build(privateKey);

        DigestCalculatorProvider digestProvider = new JcaDigestCalculatorProviderBuilder()
                .setProvider("BC")
                .build();

        SignerInfoGenerator signerInfoGenerator = new JcaSignerInfoGeneratorBuilder(digestProvider)
                .build(contentSigner, certList.get(0));

        CMSSignedDataGenerator gen = new CMSSignedDataGenerator();
        gen.addSignerInfoGenerator(signerInfoGenerator);
        gen.addCertificates(certStore);

        CMSTypedData msg = new CMSProcessableInputStream(content);
        CMSSignedData signedData = gen.generate(msg, false); // detached
        return signedData.getEncoded();
    }

    static class CMSProcessableInputStream implements CMSTypedData {
        private final InputStream in;
        CMSProcessableInputStream(InputStream is) { this.in = is; }
        @Override public Object getContent() { return in; }
        @Override public ASN1ObjectIdentifier getContentType() { return PKCSObjectIdentifiers.data; }
        @Override public void write(OutputStream out) throws IOException, CMSException {
            byte[] buffer = new byte[8 * 1024];
            int read;
            while ((read = in.read(buffer)) != -1) out.write(buffer, 0, read);
            in.close();
        }
    }
}
