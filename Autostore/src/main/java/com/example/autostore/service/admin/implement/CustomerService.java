package com.example.autostore.service.admin.implement;

import com.example.autostore.Enum.CustomerStatus;
import com.example.autostore.dto.admin.CustomerSummaryDTO;
import com.example.autostore.mapper.CustomerBookingProjection;
import com.example.autostore.model.Customer;
import com.example.autostore.repository.ICustomerRepository;
import com.example.autostore.service.admin.interfaces.ICustomerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.Optional;

@Service
public class CustomerService implements ICustomerService {

    private final ICustomerRepository repo;

    public CustomerService(ICustomerRepository repo) {
        this.repo = repo;
    }

    @Override
    public Page<Customer> getPage(String keyword, int page, int pageSize) {
        return repo.findByCustomerNameContainingIgnoreCase(
                keyword,
                PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
    }


    @Override
    public Optional<Customer> getById(Integer id) {
        return repo.findById(id);
    }

    @Override
    public void delete(Integer id) {
        if (!repo.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy khách hàng để xóa");
        }
        repo.deleteById(id);
    }

    @Override
    public Customer updateStatus(Integer id, CustomerStatus status) {
        Customer customer = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng với ID = " + id));
        customer.setStatus(status);
        return repo.save(customer);
    }

    @Override
    public Page<CustomerSummaryDTO> getCustomerSummary(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CustomerBookingProjection> projections = repo.findCustomerBookingSummary(keyword, pageable);

        return projections.map(p -> new CustomerSummaryDTO(
                p.getCustomerId(),
                p.getCustomerName(),
                p.getCustomerEmail(),
                p.getCustomerPhone(),
                p.getCustomerAddress(),
                p.getStatus(),
                p.getLastBookingDate(),
                p.getLastCarName(),
                p.getTotalBookings()
        ));
    }

    public void deleteCustomer(Integer id) {
        repo.deleteById(id);
    }



}
