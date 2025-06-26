// package com.example.collaborative.to_do_list.config;

// import org.springframework.context.event.EventListener;
// import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
// import org.springframework.stereotype.Component;
// import org.springframework.web.socket.messaging.SessionDisconnectEvent;

// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;

// @Component
// @RequiredArgsConstructor
// @Slf4j
// public class WebSocketEventListener {

//      @EventListener
//     public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
//         StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
//         String sessionId = headerAccessor.getSessionId(); // Get the session ID
//         System.out.println("User disconnected: " + sessionId);

//         // Perform cleanup tasks (e.g., remove the user from active sessions)
//     }
// }
