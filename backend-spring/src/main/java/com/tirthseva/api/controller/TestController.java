package com.tirthseva.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of("message", "API is working!"));
    }
}
