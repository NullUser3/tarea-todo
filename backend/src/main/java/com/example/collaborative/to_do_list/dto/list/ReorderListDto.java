package com.example.collaborative.to_do_list.dto.list;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReorderListDto {
    private UUID id;
    private int position;
}
