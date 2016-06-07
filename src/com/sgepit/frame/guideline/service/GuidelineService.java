/**
 * Central China Technology Development of Electric Power Company LTD.
 * @author: Shirley
 * @version: 2009
 *
 *
 */

package com.sgepit.frame.guideline.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.guideline.hbm.SgccGuidelineFormula;
import com.sgepit.frame.guideline.hbm.SgccGuidelineInfo;
import com.sgepit.frame.guideline.hbm.SgccGuidelineInfoVO;


/**
 * {class description}
 * @author Shirley
 * @createDate Mar 23, 2009
 **/
public interface GuidelineService {
	
	/**
	  * 建指标树
	  * @param treeName
	  * @param parentId
	  * @return
	  * @throws BusinessException
	  **/
public List<SgccGuidelineInfo> buildTreeNodes(String treeName, String parentId, Map param) ;

	/**
	  * 获得指标的下级结点
	  * @param parentId
	  * @return
	  * @throws BusinessException
	  **/
	public List<SgccGuidelineInfo> getGuidelinesByParentId(String parentId, Map param);
	
	/**
	  * 获得指标的下级结点(页面列表用)
	  * @param orderby
	  * @param start
	  * @param limit
	  * @param map
	  * @return
	  * @throws BusinessException
	  **/
	public List<SgccGuidelineInfo> getGuidelinesByParentId(String orderby, Integer start, Integer limit,
			HashMap map)throws BusinessException;
	
	/**
	  * 获得指标下级结点的个数
	  * @param parentId
	  * @return
	  **/
	public int getCountByParentId(String parentId);
	
	/**
	 * 拼指标下达Column树JSON串
	 * @author wangh
	 * @time Apr 28, 2009
	 * @description
	 * @param parentId
	 * @param guideType
	 * @return
	 */
	public String ConvertGuidelineXDJSon(String parentId,String guideType);
	
	/**
	 * 通过单位ID获得单位名称
	 * @param unitid
	 * @return
	 */
	public String getUnitName(String unitid);
	
	/**
	  * 添加一条公式
	  * @param guidelineInfo
	  * @return
	  **/
	public boolean addGuidelineFormula(SgccGuidelineFormula formula)throws BusinessException;
	
	/**
	  * 修改指标公式
	  * @param formula
	  * @return
	  **/
	public boolean saveGuidelineFormula(SgccGuidelineFormula formula)throws BusinessException;
	
	/**
	  * 删除指标公式
	  * @param formula
	  * @return
	  **/
	public boolean deleteGuidelineFormula(SgccGuidelineFormula formula);
	
	/**
	 * 获取下达给某单位的所有指标
	 * @author wangh
	 * @time Apr 28, 2009
	 * @description
	 * @param unitId
	 * @return
	 */
	public String getDownHistoryTree(String unitId) ;
	
	/**
	  * 添加一条记录
	  * @param guidelineInfo
	  * @return
	  **/
	public boolean addGuidelineInfo(SgccGuidelineInfo guidelineInfo);
	/**
	  * 根据主键获得指标信息
	  * @param zbSeqno
	  * @return
	  **/
	public SgccGuidelineInfo getGuidelineInfoByID(String zbSeqno);
	/**
	  * 修改指标信息
	  * @param guidelineInfo
	  * @return
	  **/
	public boolean saveGuidelineInfo(SgccGuidelineInfoVO guidelineInfoVO);
	/**
	  * 删除指标
	  * @param guidelineInfo
	  * @return
	  **/
	public boolean deleteGuideline(SgccGuidelineInfo guidelineInfo);
	
	/**
	  * 设置所有指标的公式
	  * 只有类别为“具体指标”，而且计量单位不为空的指标才可以设置公式
	  * 如果该指标已经存在公式，则不变
	  * @return
	  **/
	public boolean setAllGuidelineFormula();
	/**
	  * 获得单位列表（不包含分类，加上了属性管理的指标单位类型）
	  * 新增和修改指标时选择所属单位会用到
	  * @return
	  **/
	public List getUnitWithProperty();
	
	/**
	  * 移动指标
	  * @param ids
	  * @param targetId
	  * @return
	  **/
	public boolean moveGuidelineInfo(String ids,String targetId);
	
	/**
	 * 工资科目中判断指标名称是否存在
	 * @param realname
	 * @return 1:存在 0:不存在
	 * @author zhangh
	 * @version 2012.04.05
	 */
	public String checkRealName(String realname, String parentid);
	
}
