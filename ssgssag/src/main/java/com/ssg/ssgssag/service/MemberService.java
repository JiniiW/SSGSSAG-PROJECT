package com.ssg.ssgssag.service;

import com.ssg.ssgssag.domain.MemberVO;
import com.ssg.ssgssag.dto.MemberDTO;
import java.util.List;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public interface MemberService {

    void registerMember(MemberDTO member);

    List<MemberDTO> getAllMembers();

    List<MemberDTO> getMemberList(MemberDTO memberDTO);

    MemberVO getOneMemberInModal(String getMemberId);

    void modifyMembersByAdmin(MemberDTO memberDTO);

    void modifyMemberInfo(MemberDTO memberDTO);

    //중복 아이디
    boolean checkIdInfo(String vMemberId);

    UserDetails loadUserByUsername(String memberId) throws UsernameNotFoundException;

    MemberVO getMemberByMemberId(String memberId);

    MemberVO login(MemberDTO memberDTO);

    int modifyPassword(MemberDTO member);

    byte[] getMemberProfileImg(String vMemberId);
    Boolean deleteMember(MemberDTO memberDTO);

}
