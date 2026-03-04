package com.tirthseva.api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImagesController {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(".jpg", ".jpeg", ".png", ".webp");

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile image,
            @RequestParam(value = "type", defaultValue = "temple") String type) {
        if (image == null || image.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "No image file provided"));
        }

        // Validate file size
        if (image.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "File size exceeds 5MB limit"));
        }

        // Validate file extension
        String originalFilename = image.getOriginalFilename();
        String extension = originalFilename != null
                ? originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase()
                : "";

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Only JPG, JPEG, PNG, and WEBP files are allowed"));
        }

        try {
            // Generate unique filename
            String fileName = UUID.randomUUID().toString() + extension;
            String folder = type.equals("bhaktnivas") ? "bhaktnivas" : "temples";
            Path uploadsPath = Paths.get(uploadDir, folder);

            // Ensure directory exists
            if (!Files.exists(uploadsPath)) {
                Files.createDirectories(uploadsPath);
            }

            Path filePath = uploadsPath.resolve(fileName);
            Files.copy(image.getInputStream(), filePath);

            // Return relative path that can be used in URLs
            String relativePath = "/uploads/" + folder + "/" + fileName;
            return ResponseEntity.ok(Map.of("imagePath", relativePath));

        } catch (IOException e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error uploading image: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteImage(@RequestParam String imagePath) {

        if (imagePath == null || imagePath.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Image path is required"));
        }

        try {
            String cleanPath = imagePath.startsWith("/")
                    ? imagePath.substring(1)
                    : imagePath;

            Path fullPath = Paths.get(cleanPath);

            if (Files.exists(fullPath)) {
                Files.delete(fullPath);
                return ResponseEntity.ok(Map.of("message", "Image deleted successfully"));
            }

            return ResponseEntity.status(404)
                    .body(Map.of("message", "Image not found"));

        } catch (IOException e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error deleting image: " + e.getMessage()));
        }
    }

}
