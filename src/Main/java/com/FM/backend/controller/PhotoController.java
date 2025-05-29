package com.FM.backend.controller;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.File;

@RestController
@RequestMapping("/api")
public class PhotoController {

    @PostMapping("/photo")
    public ResponseEntity<Map<String, String>> uploadPhoto(@RequestParam("file") MultipartFile file) {
      // 1. 파일 저장 (예: /uploads/ 폴더)
      // 2. Ready Player Me API 연동 (현재는 생략하고 mock URL 제공)

      String avatarUrl = "https://models.readyplayer.me/68171f140fbc155434dfb97d.glb"; // 예시 URL
      Map<String, String> result = new HashMap<>();
      result.put("avatarUrl", avatarUrl);

      return ResponseEntity.ok(result);
    }
    
    @PostMapping("/upload")
    public ResponseEntity<String> handleUpload(@RequestParam("image") MultipartFile image) {
      // 현재 실행 디렉터리 기준 uploads 폴더 경로 생성
      String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
    
      try {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
          boolean created = dir.mkdirs();
          if (!created) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("폴더 생성 실패");
          }
        }
    
        // 저장 경로 설정
        String filePath = uploadDir + File.separator + image.getOriginalFilename();
        image.transferTo(new File(filePath));
    
        return ResponseEntity.ok("파일 업로드 성공: " + filePath);
      } catch (IOException e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("업로드 실패");
      }
    }

  @PostMapping("/generate-3d")
  public ResponseEntity<String> generate3DModel() {
    String workingDir = System.getProperty("user.dir");
    String inputDir = workingDir + File.separator + "uploads";
    String outputDir = workingDir + File.separator + "uploads" + File.separator + "result";

    System.out.println("workingDir: " + workingDir);
    System.out.println("outputDir: " + outputDir);

    try {
        String pythonExePath = "C:\\Users\\rjsgh\\AppData\\Local\\Programs\\Python\\Python310\\python.exe";
        String pifuhdDir = "C:\\Users\\rjsgh\\backend\\backend\\src\\main\\pifuhd";
        String runScript = "run_pifuhd.py"; // simple_test.py를 래핑한 스크립트

        ProcessBuilder pb = new ProcessBuilder(
            pythonExePath,
            runScript,
            inputDir,
            outputDir
        );

        // 실행 디렉터리 설정
        pb.directory(new File(pifuhdDir));

        // 환경 변수 설정
        Map<String, String> env = pb.environment();
        env.put("PYTHONPATH", pifuhdDir);

        pb.redirectErrorStream(true);

        Process process = pb.start();

        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            return ResponseEntity.status(500).body("3D model generation failed");
        }

        // ✅ 결과 파일 복사
        Path reconDir = Paths.get(outputDir, "pifuhd_final", "recon");
        Path srcObj = reconDir.resolve("result_test_512.obj");
        Path destObj = reconDir.resolve("result_input_512.obj");

        Files.copy(srcObj, destObj, StandardCopyOption.REPLACE_EXISTING);

        // ✅ .mtl 및 .png도 복사 (존재할 경우만)
        Path srcMtl = reconDir.resolve("result_test_512.mtl");
        Path destMtl = reconDir.resolve("result_input_512.mtl");

        Path srcPng = reconDir.resolve("result_test_512.png");
        Path destPng = reconDir.resolve("result_input_512.png");

        if (Files.exists(srcMtl)) {
            Files.copy(srcMtl, destMtl, StandardCopyOption.REPLACE_EXISTING);
        }

        if (Files.exists(srcPng)) {
            Files.copy(srcPng, destPng, StandardCopyOption.REPLACE_EXISTING);
        }

        return ResponseEntity.ok("3D model generated successfully");

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Server error: " + e.getMessage());
    }
  }
}