package com.custom.pc.security;

import com.custom.pc.model.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

public class UserPrincipal implements UserDetails {
    private final Usuario usuario;

    public UserPrincipal(Usuario usuario){
        this.usuario = usuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(usuario.getRol().name()));
    }

    @Override
    public String getPassword() {return usuario.getPass();}

    @Override
    public String getUsername() {return usuario.getEmail();}

    public String getEmail(){ return usuario.getEmail();}

    public String getNombre(){return usuario.getNombre();}

    public String getApellido(){return usuario.getApellido();}

    public String getRol(){return usuario.getRol().name();}

    public Long getId(){return usuario.getId();}

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return usuario.isActivo();
    }
}
