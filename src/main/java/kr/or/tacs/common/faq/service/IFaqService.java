package kr.or.tacs.common.faq.service;

import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.dto.FaqRequest;
import kr.or.tacs.vo.FaqSearchVO;
import kr.or.tacs.vo.FaqVO;

public interface IFaqService {

    PaginationInfoVO<FaqVO> retrieveFaqList(FaqSearchVO search, CustomUser loginUser);

    PaginationInfoVO<FaqVO> retrieveFaqAdminList(FaqSearchVO search);

    FaqVO retrieveFaq(Long faqNo, boolean increaseHit, CustomUser loginUser);

    FaqVO retrieveFaqForAdmin(Long faqNo);

    Long registFaq(FaqRequest request, CustomUser loginUser);

    void modifyFaq(Long faqNo, FaqRequest request);

    void deleteFaq(Long faqNo);
}
