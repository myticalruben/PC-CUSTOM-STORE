package com.custom.pc.controller;

import com.custom.pc.dto.JwtResponse;
import com.custom.pc.dto.LoginRequest;
import com.custom.pc.dto.RegisterRequest;
import com.custom.pc.model.RolUsuario;
import com.custom.pc.model.Usuario;
import com.custom.pc.repository.UsuarioRepository;
import com.custom.pc.security.JwtUtils;
import com.custom.pc.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authentication(@Valid @RequestBody LoginRequest loginRequest){
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(auth);
        String jwt = jwtUtils.generateJwtToken(auth);

        UserPrincipal userDetails = (UserPrincipal) auth.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getNombre(),
                userDetails.getApellido(),
                userDetails.getRol()
        ));
    }

    @PostMapping("/registaer")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest){
        if (usuarioRepository.existsByEmail(registerRequest.getEmail())){
            return ResponseEntity.badRequest().body("Error: El email ya esta en uso!!");
        }

        var usuario = new Usuario(
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getNombre(),
                registerRequest.getApellido(),
                RolUsuario.valueOf(registerRequest.getRol())
        );

        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Usuario registrado exitosamente!!");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();

        var usuario = usuarioRepository.findById(userPrincipal.getId());

        if(usuario.isPresent()){
            return ResponseEntity.ok(new JwtResponse(
                    null,
                    usuario.get().getId(),
                    usuario.get().getEmail(),
                    usuario.get().getNombre(),
                    usuario.get().getApellido(),
                    usuario.get().getRol().name()
            ));
        }

        return ResponseEntity.notFound().build();
    }
}
