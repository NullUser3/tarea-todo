package com.example.collaborative.to_do_list.config;

import com.example.collaborative.to_do_list.service.JwtService;
import com.example.collaborative.to_do_list.service.MyUserDetailsService;

import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;

@Component // Marks this class as a Spring-managed bean
@RequiredArgsConstructor // Generates a constructor with required (final) fields
public class JwtAuthenticationFilter extends OncePerRequestFilter { // Filter that runs once per request

    // Injecting JwtService to generate/validate JWT tokens
    private final JwtService jwtService;

    // Injecting custom UserDetailsService to load user data from DB
    private final MyUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Extracting the "Authorization" header from the HTTP request
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // If header is missing or doesn't start with "Bearer ", skip JWT auth check and move to next filter
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Remove "Bearer " prefix to extract the raw token
        jwt = authHeader.substring(7);

        // Extract username (subject) from token payload
        try {
        username = jwtService.extractUsername(jwt);
    } catch (JwtException e) {
        // Token is expired or malformed — just skip auth and continue
        filterChain.doFilter(request, response);
        return;
    }

        // If username is found and the SecurityContext doesn't have an authentication yet (user isn't logged in)
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Load user details (roles, password hash, etc.) from DB using the username
            var userDetails = userDetailsService.loadUserByUsername(username);

            // If the token is valid (signature, expiration, etc.)
            if (jwtService.isTokenValid(jwt)) {

                // Build an Authentication object for this user (with roles/authorities)
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,    // principal (user details)
                                null,          // credentials (null because we don't need the password now)
                                userDetails.getAuthorities() // user roles/authorities
                        );

                // Attach request metadata (like remote IP address, session ID) to the Authentication object
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Set this Authentication in the SecurityContext — meaning this user is now authenticated for this request
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Move to next filter in chain or controller endpoint if this is the last one
        filterChain.doFilter(request, response);
    }
}

