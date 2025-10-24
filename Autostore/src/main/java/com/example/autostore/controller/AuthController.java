package com.example.autostore.controller;

import com.example.autostore.Enum.ERole;
import com.example.autostore.dto.JwtResponse;
import com.example.autostore.dto.SignInRequest;
import com.example.autostore.dto.SignUpRequest;
import com.example.autostore.model.AppUser;
import com.example.autostore.model.Customer;
import com.example.autostore.model.Role;
import com.example.autostore.repository.ICustomerRepository;
import com.example.autostore.repository.RoleRepository;
import com.example.autostore.repository.UserRepository;
import com.example.autostore.service.UserDetailsImpl;
import com.example.autostore.service.user.implement.UserService;
import com.example.autostore.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.autostore.dto.RefreshTokenRequest;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final ICustomerRepository customerRepository;




    // === LOGIN ===
    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody SignInRequest signInRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        signInRequest.getUserName(),   // login bằng userName
                        signInRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtUtil.generateAccessToken(authentication);
        String refreshToken = jwtUtil.generateRefreshToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(
                accessToken,
                refreshToken,
                userDetails.getId(),
                userDetails.getUserName(),
                roles
        ));
    }

    // === REGISTER ===
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByUserName(signUpRequest.getUserName())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken");
        }
        if (userRepository.existsByuserEmail(signUpRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already taken");
        }

        String hashedPassword = passwordEncoder.encode(signUpRequest.getPassword());

        Set<Role> roles = new HashSet<>();
        Optional<Role> userRole = roleRepository.findByName(ERole.ROLE_USER);
        if (userRole.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Role USER not found");
        }
        roles.add(userRole.get());

        AppUser user = new AppUser();
        user.setUserName(signUpRequest.getUserName());
        user.setUserEmail(signUpRequest.getEmail());
        user.setUserPassword(hashedPassword);
        user.setUserIsActive(true);
        user.setRoles(roles);

        AppUser savedUser = userRepository.save(user);

        // ✅ Tạo Customer gắn với user mới đăng ký
        Customer customer = new Customer();
        customer.setAppUser(savedUser);
        customer.setCustomerName(signUpRequest.getUserFullName());
        customer.setCustomerEmail(signUpRequest.getEmail());
        customer.setCustomerPhone(signUpRequest.getUserPhone());
        customer.setCustomerAddress("");
        customerRepository.save(customer);

        return ResponseEntity.ok("User registered successfully");
    }


    // === REFRESH TOKEN ===
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshTokenRequest request) {
        try {
            String refreshToken = request.getRefreshToken();
            if (!jwtUtil.validateToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
            }

            String username = jwtUtil.getUsernameFromToken(refreshToken);
            AppUser user = userRepository.findByUserName(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserDetailsImpl userDetails = UserDetailsImpl.build(user);

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
            );

            // cấp lại cả accessToken + refreshToken mới
            String newAccessToken = jwtUtil.generateAccessToken(authentication);
            String newRefreshToken = jwtUtil.generateRefreshToken(authentication);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(
                    newAccessToken,
                    newRefreshToken,
                    userDetails.getId(),
                    userDetails.getUserName(),
                    roles
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error refreshing token: " + e.getMessage());
        }
    }
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = userService.checkEmailExists(email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUserName(@RequestParam String userName) {
        boolean exists = userService.checkUserNameExists(userName);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

}
