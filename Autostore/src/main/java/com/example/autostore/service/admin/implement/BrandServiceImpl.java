package com.example.autostore.service.admin.implement;

import com.example.autostore.dto.admin.BrandDTO;
import com.example.autostore.model.Brand;
import com.example.autostore.repository.IBrandRepository;
import com.example.autostore.service.FileUploadService;
import com.example.autostore.service.admin.interfaces.IBrandService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BrandServiceImpl implements IBrandService {

    private final IBrandRepository brandRepo;
    private final FileUploadService fileUploadService;

    public BrandServiceImpl(IBrandRepository brandRepo, FileUploadService fileUploadService) {
        this.brandRepo = brandRepo;
        this.fileUploadService = fileUploadService;
    }

    private BrandDTO toDTO(Brand brand) {
        return new BrandDTO(
                brand.getBrandId(),
                brand.getBrandName(),
                brand.getDescription(),
                brand.getLogoUrl()
        );
    }

    @Override
    public List<BrandDTO> findAll() {
        return brandRepo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BrandDTO findById(Integer brandId) {
        return brandRepo.findById(brandId).map(this::toDTO).orElse(null);
    }

    @Override
    public BrandDTO create(BrandDTO dto) {
        Brand brand = new Brand();
        brand.setBrandName(dto.getBrandName());
        brand.setDescription(dto.getDescription());
        brand.setLogoUrl(dto.getLogoUrl());
        return toDTO(brandRepo.save(brand));
    }

    public BrandDTO createWithLogo(BrandDTO dto, MultipartFile logo) throws IOException {
        Brand brand = new Brand();
        brand.setBrandName(dto.getBrandName());
        brand.setDescription(dto.getDescription());

        if (logo != null && !logo.isEmpty()) {
            String url = fileUploadService.uploadFile(logo);
            brand.setLogoUrl(url);
        }

        return toDTO(brandRepo.save(brand));
    }

    @Override
    public BrandDTO update(Integer brandId, BrandDTO dto) {
        Brand brand = brandRepo.findById(brandId).orElseThrow();
        brand.setBrandName(dto.getBrandName());
        brand.setDescription(dto.getDescription());
        brand.setLogoUrl(dto.getLogoUrl());
        return toDTO(brandRepo.save(brand));
    }

    public BrandDTO updateWithLogo(Integer brandId, BrandDTO dto, MultipartFile logo) throws IOException {
        Brand brand = brandRepo.findById(brandId).orElseThrow();
        brand.setBrandName(dto.getBrandName());
        brand.setDescription(dto.getDescription());

        if (logo != null && !logo.isEmpty()) {
            String url = fileUploadService.uploadFile(logo);
            brand.setLogoUrl(url);
        }

        return toDTO(brandRepo.save(brand));
    }

    @Override
    public void delete(Integer brandId) {
        brandRepo.deleteById(brandId);
    }

    @Override
    public Page<BrandDTO> findByKeyword(String keyword, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        return (keyword == null || keyword.isBlank())
                ? brandRepo.findAll(pageable).map(this::toDTO)
                : brandRepo.findByBrandNameContainingIgnoreCase(keyword, pageable).map(this::toDTO);
    }
}
