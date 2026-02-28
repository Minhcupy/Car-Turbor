package com.example.autostore.config;

import com.example.autostore.filter.AuthTokenFilter;
import com.example.autostore.service.AuthEntryPointJwt;
import com.example.autostore.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final UserDetailsServiceImpl userDetailsService;
    private final AuthEntryPointJwt authEntryPointJwt;
    private final AuthTokenFilter authTokenFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
                    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(Arrays.asList("*"));
                    config.setExposedHeaders(Arrays.asList("Authorization"));
                    config.setAllowCredentials(true);
                    return config;
                }))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(authEntryPointJwt))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. PUBLIC (không cần login)
                        .requestMatchers("/api/auth/**").permitAll()        // login, register
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/cars/**",
                                "/images/**",
                                "/api/reviews/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/api/brands/**", 
                                "/api/user/cars/**",
                                "/api/user/cars/featured",
                                "/api/user/bookings/**",
                                "/api/pricing/**",
                                "/api/admin/bookings/*/qrcode",
                                "api/test/send-mail"
                        ).permitAll()
                        .requestMatchers("/api/face/**").authenticated()
                        .requestMatchers("/error","/api/vnpay/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/user/contracts/*/download").permitAll()
                        .requestMatchers("/api/user/contracts/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/user/bookings/**").permitAll()
                        .requestMatchers("/ws/**", "/ws-chat/**", "/api/chat/**").permitAll()
                        .requestMatchers("/api/chatbot").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/user/me/avatar").authenticated()

                        // 2. USER + ADMIN (phải login mới được gọi)
                        .requestMatchers("/api/messages/**").authenticated()
                        .requestMatchers("/api/chat/**").authenticated()

                        .requestMatchers("/api/user/payments/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/reviews/**").hasAnyRole("USER", "ADMIN")

                        // 3. ADMIN ONLY
                        // 3. ADMIN (chỉ cần login là được)
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/cars/**").hasRole("ADMIN") //
                        .requestMatchers(HttpMethod.GET, "/api/brands/**").permitAll()
                        // Xem được không cần login
                        .requestMatchers(HttpMethod.POST, "/api/cars/**").hasRole("ADMIN") //
                        .requestMatchers(HttpMethod.POST, "/api/brands/**").hasRole("ADMIN") //
                        .requestMatchers(HttpMethod.PUT, "/api/brands/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/brands/**").hasRole("ADMIN")
                        .anyRequest().authenticated() );

        // JWT filter
        http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
