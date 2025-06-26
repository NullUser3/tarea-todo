package com.example.collaborative.to_do_list.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import static org.springframework.security.config.Customizer.withDefaults;
import com.example.collaborative.to_do_list.service.MyUserDetailsService;
// Declares this class as a configuration class for Spring
@Configuration
// Enables Spring Security's web security features
@EnableWebSecurity
public class SecurityConfig {
    
    // Injects the UserDetailsService bean to load user-specific data
    private final MyUserDetailsService myUserDetailsService;

    public SecurityConfig(MyUserDetailsService myUserDetailsService) {
        this.myUserDetailsService = myUserDetailsService;
    }

    // Defines the security filter chain that applies to all HTTP requests
    @Bean
 public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthFilter) throws Exception {
    return http
            .csrf(csrf -> csrf.disable()) // Disable CSRF protection (because we are using stateless JWT auth)
            .cors(withDefaults())
            .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/login", "/api/createUser" , "/api/refresh-token" ,"/api/logout","/error")
            .permitAll()
                // .anyRequest().permitAll() // Allow public access to these endpoints
            .anyRequest().authenticated() // Any other request requires authentication
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class) // Run JWT filter before Spring’s default username/password filter
            .build(); // Build and return the SecurityFilterChain
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:3000")); // your React dev server
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE","PATCH","OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}

    // Creates an AuthenticationProvider bean for authenticating users
    @Bean
    public AuthenticationProvider authenticationProvider(){
        // Creates a DAO (Data Access Object) authentication provider
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        
        // Sets the password encoder to BCrypt with strength 12
        provider.setPasswordEncoder(new BCryptPasswordEncoder(12));
        
        // Sets the UserDetailsService for loading user details
        provider.setUserDetailsService(myUserDetailsService);
        
        return provider;
    }

    // Creates an AuthenticationManager bean
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        // Gets the AuthenticationManager from the configuration
        return config.getAuthenticationManager();
    }
}