package com.example.collaborative.to_do_list.converters;

import com.example.collaborative.to_do_list.model.TeamMember;
import com.example.collaborative.to_do_list.model.TeamMember.Role;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class LowercaseTypeConverter implements AttributeConverter<Role, String> {

    @Override
    public String convertToDatabaseColumn(Role role) {
        return role != null ? role.name().toLowerCase() : null;
    }

    @Override
    public Role convertToEntityAttribute(String dbValue) {
        return dbValue != null ? 
            Role.valueOf(dbValue.toUpperCase()) : 
            null;
    }
}
