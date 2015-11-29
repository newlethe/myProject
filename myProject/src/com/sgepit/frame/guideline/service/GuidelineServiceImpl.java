/**
 * Central China Technology Development of Electric Power Company LTD.
 * @author: Shirley
 * @version: 2009
 *
 *
 */

package com.sgepit.frame.guideline.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.sysman.dao.SgccIniUnitDAO;
import com.sgepit.frame.sysman.dao.SystemDao;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.BusinessConstants;
import com.sgepit.frame.guideline.dao.SgccGuidelineFormulaDAO;
import com.sgepit.frame.guideline.dao.SgccGuidelineInfoDAO;
import com.sgepit.frame.guideline.hbm.SgccGuidelineFormula;
import com.sgepit.frame.guideline.hbm.SgccGuidelineInfo;
import com.sgepit.frame.guideline.hbm.SgccGuidelineInfoVO;
import com.sgepit.frame.guideline.util.GuidelineIdUtil;


/**
 * {class description}
 * @author Shirley
 * @createDate Mar 23, 2009
 **/
public class GuidelineServiceImpl extends BaseMgmImpl implements GuidelineService {
	SgccGuidelineInfoDAO sgccGuidelineInfoDAO;
	
	
	SgccGuidelineFormulaDAO sgccGuidelineFormulaDAO;
	
	SystemDao systemDao;
	
	SgccIniUnitDAO sgccIniUnitDAO;
	
	/**
	 * @param sgccGuidelineFormulaDAO the sgccGuidelineFormulaDAO to set
	 */
	public void setSgccGuidelineFormulaDAO(
			SgccGuidelineFormulaDAO sgccGuidelineFormulaDAO) {
		this.sgccGuidelineFormulaDAO = sgccGuidelineFormulaDAO;
	}

	/**
	 * @param sgccIniUnitDAO the sgccIniUnitDAO to set
	 */
	public void setSgccIniUnitDAO(SgccIniUnitDAO sgccIniUnitDAO) {
		this.sgccIniUnitDAO = sgccIniUnitDAO;
	}

	/**
	 * @param sgccGuidelineInfoDAO the sgccGuidelineInfoDAO to set
	 */
	public void setSgccGuidelineInfoDAO(SgccGuidelineInfoDAO sgccGuidelineInfoDAO) {
		this.sgccGuidelineInfoDAO = sgccGuidelineInfoDAO;
	}
	
	public void setSystemDao(SystemDao systemDao) {
		this.systemDao = systemDao;
	}

	/**
	  * 建树
	  * @param treeName
	  * @param parentId
	  * @return
	  **/
	public List<SgccGuidelineInfo> buildTreeNodes(String treeName, String parentId , Map param) {
		List<SgccGuidelineInfo> list = null;
		if (treeName.equals(BusinessConstants.TREE_GUIDELINE)) {
			list = getGuidelinesByParentId(parentId,param);
		}
		return list;
	}
	
	/**
	  * 获得指标的下级结点
	  * @param parentId
	  * @return
	  **/
	public List<SgccGuidelineInfo> getGuidelinesByParentId(String parentId, Map param) {
		String sql = "parentid='"+parentId+"'";
		//String sql = "parentid='"+parentId+"' and zb_seqno ='005'";
		if(param.get("filterNode")!=null){
			sql +=" and zb_seqno='"+(String)param.get("filterNode")+"'";
		}
		if(param.get("state")!=null){
			sql += " and state='"+(String)param.get("state")+"' ";
		}
		sql+=" order by id";
		List<SgccGuidelineInfo> list = this.sgccGuidelineInfoDAO.findByWhere(com.sgepit.frame.guideline.hbm.SgccGuidelineInfo.class.getName(), sql);
		return list;
	}
	
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
			HashMap map)throws BusinessException {
		String parentId = (String)map.get("parentid");
		List<SgccGuidelineInfo> list = this.sgccGuidelineInfoDAO.findByProperty(com.sgepit.frame.guideline.hbm.SgccGuidelineInfo.class.getName()
				, "parentid", parentId, orderby,null,null);
		
		return list;
	}
	
	/**
	  * 获得指标下级结点的个数
	  * @param parentId
	  * @return
	  **/
	public int getCountByParentId(String parentId) {
		return this.sgccGuidelineInfoDAO.countByProperty(com.sgepit.frame.guideline.hbm.SgccGuidelineInfo.class.getName(), "parentid", parentId);
	}
	
	/**
	  * 添加一条记录
	  * @param guidelineInfo
	  * @return
	  **/
	public boolean addGuidelineInfo(SgccGuidelineInfo guidelineInfo){
		try{
			//TODO xiangll 检查排序，不能重复
			checkGuidelineUnitId(guidelineInfo);
			String zbSeqno = GuidelineIdUtil.newGuidelineId(guidelineInfo.getParentid());
			guidelineInfo.setZbSeqno(zbSeqno);
			SgccGuidelineInfo parent = (SgccGuidelineInfo)sgccGuidelineInfoDAO.findBeanByProperty("zbSeqno", guidelineInfo.getParentid());
			guidelineInfo.setPath(parent.getPath()+"`"+zbSeqno);
			sgccGuidelineInfoDAO.insert(guidelineInfo);
		}catch (Exception e) {
			return false;
		}
		return true;
	}
	
	
	/**
	  * 根据主键获得指标信息
	  * @param zbSeqno
	  * @return
	  **/
	public SgccGuidelineInfo getGuidelineInfoByID(String zbSeqno){
		SgccGuidelineInfo guidelineInfo = (SgccGuidelineInfo)sgccGuidelineInfoDAO.findByCompId(zbSeqno);
		return guidelineInfo;
	}
	
	/**
	  * 修改指标信息
	  * @param guidelineInfo
	  * @return
	  **/
	public boolean saveGuidelineInfo(SgccGuidelineInfoVO guidelineInfoVO){
		try{
			SgccGuidelineInfo guidelineInfo = (SgccGuidelineInfo)sgccGuidelineInfoDAO.findBeanByProperty("zbSeqno", guidelineInfoVO.getZbSeqno());
			BeanUtils.copyProperties(guidelineInfo, guidelineInfoVO);
			checkGuidelineUnitId(guidelineInfo);
			sgccGuidelineInfoDAO.saveOrUpdate(guidelineInfo);
		}catch (Exception e) {
			return false;
		}
		return true;
	}
	
	/**
	  * 删除指标
	  * @param guidelineInfo
	  * @return
	  **/
	public boolean deleteGuideline(SgccGuidelineInfo guidelineInfo){
		try{
			//TODO xiangll 判断指标是否被用到
			//删除所有下级指标结点
			String where  = "path like '"+guidelineInfo.getPath()+"`%'";
			List list = sgccGuidelineInfoDAO.findByWhere(com.sgepit.frame.guideline.hbm.SgccGuidelineInfo.class.getName(), where);
			if(list!=null&&list.size()>0){
				for(int i=0;i<list.size();i++){
					sgccGuidelineInfoDAO.delete(list.get(i));
				}
			}
			//删除指标
			sgccGuidelineInfoDAO.delete(guidelineInfo);
		}catch (Exception e) {
			return false;
		}
		return true;
	}
	
	/**
	  * 移动指标
	  * @param ids
	  * @param targetId
	  * @return
	  **/
	public boolean moveGuidelineInfo(String ids,String targetId){
		try{
			List list = sgccGuidelineInfoDAO.findByWhere(" id in("+ids+")", null, null, null);
			if(list!=null&&list.size()>0){
				SgccGuidelineInfo guideline = null;
				for(int i=0;i<list.size();i++){
					guideline = (SgccGuidelineInfo)list.get(i);
					guideline.setParentid(targetId);
					SgccGuidelineInfo parent = (SgccGuidelineInfo)sgccGuidelineInfoDAO.findBeanByProperty("zbSeqno", targetId);
					guideline.setPath(parent.getPath()+"`"+guideline.getZbSeqno());
					sgccGuidelineInfoDAO.saveOrUpdate(guideline);
				}
			}
		}catch (Exception e) {
			return false;
		}
		return true;
	}
	///////////////////////////////指标公式////////////////////////////////////////////////////////////////////
	
	/**
	  * 添加一条公式
	  * @param guidelineInfo
	  * @return
	  **/
	public boolean addGuidelineFormula(SgccGuidelineFormula formula)throws BusinessException{
		try{
			String where  = " zb_seqno = '"+formula.getZbSeqno()+"' and formulaType='"+formula.getFormulaType()+"'";
			List list = sgccGuidelineFormulaDAO.findByWhere(where, null, null, null);
			if(list!=null&&list.size()>0){
				throw new BusinessException(BusinessConstants.MSG_GUIDELILNE_FORMULA_TYPE);
			}
			sgccGuidelineFormulaDAO.insert(formula);
		}catch (Exception e) {
			throw new BusinessException(e.getMessage());
		}
		return true;
	}
	
	/**
	  * 修改指标公式
	  * @param guidelineInfo
	  * @return
	  **/
	public boolean saveGuidelineFormula(SgccGuidelineFormula formula)throws BusinessException{
		try{
			String where  = " zb_seqno = '"+formula.getZbSeqno()+"' and formulaType='"+formula.getFormulaType()+"' and id<>'"+formula.getId()+"'";
			List list = sgccGuidelineFormulaDAO.findByWhere(where, null, null, null);
			if(list!=null&&list.size()>1){
				throw new BusinessException(BusinessConstants.MSG_GUIDELILNE_FORMULA_TYPE);
			}
			sgccGuidelineFormulaDAO.saveOrUpdate(formula);
		}catch (Exception e) {
			throw new BusinessException(e.getMessage());
		}
		return true;
	}
	
	/**
	  * 删除指标公式
	  * @param formula
	  * @return
	  **/
	public boolean deleteGuidelineFormula(SgccGuidelineFormula formula){
		try{
			sgccGuidelineFormulaDAO.delete(formula);
		}catch (Exception e) {
			return false;
		}
		return true;
	}
	
	/**
	  * 设置所有指标的公式
	  * 只有类别为“具体指标”，而且计量单位不为空的指标才可以设置公式
	  * 如果该指标已经存在公式，则不变
	  * @return
	  **/
	public boolean setAllGuidelineFormula(){
		try{
			List list = sgccGuidelineInfoDAO.findByWhere("sx_lb='1' and jldw is not null and state='1'", null, null, null);
			if(list!=null&&list.size()>0){
				for(int i=0;i<list.size();i++){
					SgccGuidelineInfo guideline = (SgccGuidelineInfo)list.get(i);
					String zbSeqno = guideline.getZbSeqno();
					List formulaList = sgccGuidelineFormulaDAO.findByWhere("zb_seqno='"+zbSeqno+"'", null, null, null);
					if(formulaList==null||formulaList.size()==0){
						SgccGuidelineFormula formula = null;
						String accountType = "";
						String increaseDesc = "";
						String depressDesc = "";
						String suffix = "";
						for(int j = 1;j<=3;j++){
							String jldw = guideline.getJldw();
							if(jldw.equals("%")){//如果是百分数
								if(j==1||j==2){//同比
						    		accountType = "1";//求差
						    	}else if(j==3){//计划完成率
						    		accountType = "2";//求除
						    	}
							}else{
								if(j==1){//同比
									accountType = "3";//先减后除
						    	}else if(j==2){//环比
						    		accountType = "1";//求差
						    	}else if(j==3){//计划完成率
						    		accountType = "2";//求除
						    	}
							}
							
							if(accountType.equals("1")){//求差
								increaseDesc = "增加";
								depressDesc = "减少";
								suffix = jldw;
							}else{
								increaseDesc = "增加";
								depressDesc = "降低";
								suffix = "个百分点";
							}
							if(jldw.equals("%")){//如果是百分数
								if(accountType.equals("1")){//求差
									suffix = "个百分点";
								}
							}
							
							/*
							 * 修改公式类别，使之与cell报表一致
							 * 1：同比--> tb;2:环比-->hb；3：计划完成率-->jhwcl
							 */
							String formulaType = "tb";
							if(j==2){
								formulaType = "hb";
							}else if(j==3){
								formulaType = "jhwcl";
							}
							
							
							formula = new SgccGuidelineFormula();
							formula.setZbSeqno(zbSeqno);
							
							//formula.setFormulaType(String.valueOf(j));
							formula.setFormulaType(formulaType);
							
							formula.setDecimalDigits(2);
							formula.setAccountType(accountType);
							formula.setIncreaseDesc(increaseDesc);
							formula.setIncreaseSuffix(suffix);
							formula.setDepressDesc(depressDesc);
							formula.setDepressSuffix(suffix);
							formula.setEqualDesc("持平");
							formula.setJldw(jldw);
							sgccGuidelineFormulaDAO.insert(formula);
						}
						
					}
				}
			}
		}catch (Exception e) {
			e.getStackTrace();
			return false;
		}
		
		return true;
	}
	
	//////////////////////////////////////其他//////////////////////////////////////////////////////////////////
	/**
	  * 获得单位列表（不包含分类，加上了属性管理的指标单位类型）
	  * 新增和修改指标时选择所属单位会用到
	  * @return
	  **/
	public List getUnitWithProperty(){
		StringBuffer sqlBuf = new StringBuffer();
		sqlBuf.append("select unitid, unitname,view_order_num")
				.append(" from sgcc_ini_unit t where unit_type_id not in ('0', '9', '3')")
				.append(" union ")
				.append(" select property_code as unitid, property_name as unitname, 11 as view_order_num")
				.append(" from property_code code")
				.append(" left outer join property_type type on code.type_name=type.uids ")
				.append(" where type.type_name='指标单位类型'")
				.append(" order by view_order_num");
		List list = sgccGuidelineInfoDAO.getDataAutoCloseSes(sqlBuf.toString());
		List uList = new ArrayList();
		if(list!=null&&list.size()>0){
			Iterator iter = list.iterator();
			PropertyCode property = null;
			while(iter.hasNext()){
				Object[] obj = (Object[])iter.next();
				property = new PropertyCode();
				property.setPropertyCode((String)obj[0]);
				property.setPropertyName((String)obj[1]);
				property.setItemId(((BigDecimal)obj[2]).longValue());
				uList.add(property);
			}
		}
		return uList;
	}
	/**
	  * 根据unitId获得所有上级组织机构
	  * @param unitId
	  * @return
	  **/
	private List getAllParentsByUnitid(String unitId){
		StringBuffer hqlBuf = new StringBuffer();
		hqlBuf.append("select t from SgccIniUnit t start with unitid='").append(unitId).append("' connect by prior upunit=unitid");
		//List list = sgccGuidelineInfoDAO.getDataAutoCloseSes(hqlBuf.toString());
		List list = sgccGuidelineInfoDAO.findByHql(hqlBuf.toString());
		List uList = new ArrayList();
		if(list!=null&&list.size()>0){
			Iterator iter = list.iterator();
			SgccIniUnit iniUnit = null;
			while(iter.hasNext()){
//				Object[] obj = (Object[])iter.next();
//				uList.add(obj[0]);
				iniUnit = (SgccIniUnit)iter.next();
				uList.add(iniUnit);
			}
		}
		return uList;
	}
	
	private void checkGuidelineUnitId(SgccGuidelineInfo guidelineInfo){
		SgccGuidelineInfo parentGuideline = (SgccGuidelineInfo)sgccGuidelineInfoDAO.findBeanByProperty(com.sgepit.frame.guideline.hbm.SgccGuidelineInfo.class.getName(), "zbSeqno", guidelineInfo.getParentid());
		if(guidelineInfo.getUnitId()!=null&&!guidelineInfo.getUnitId().equals("")){
			String[] unitIDs = parentGuideline.getPath().split("`");//这个指标的所有上级节点
			if(unitIDs!=null&&unitIDs.length>0){
				for(int i=0;i<unitIDs.length;i++){
					String guidelineId = unitIDs[i];
					if(!guidelineId.equals("")){
						SgccGuidelineInfo guidelineCur = (SgccGuidelineInfo)sgccGuidelineInfoDAO.findBeanByProperty(com.sgepit.frame.guideline.hbm.SgccGuidelineInfo.class.getName(), "zbSeqno", guidelineId);
						if(guidelineCur.getUnitId()!=null){
							if(guidelineInfo.getUnitId().equals(Constant.DefaultOrgRootID)){//全网
								if(!guidelineCur.getUnitId().equals(Constant.DefaultOrgRootID)){
									guidelineCur.setUnitId(guidelineInfo.getUnitId());
									sgccGuidelineInfoDAO.saveOrUpdate(guidelineCur);
								}
							}else if(guidelineInfo.getUnitId().equals("2")){//网省(需要在初始化属性管理的指标单位类型中设置网省的代码为“2”)
								if(!guidelineCur.getUnitId().equals(Constant.DefaultOrgRootID)&&!guidelineCur.getUnitId().equals("2")){
									guidelineCur.setUnitId(guidelineInfo.getUnitId());
									sgccGuidelineInfoDAO.saveOrUpdate(guidelineCur);
								}
							}else{
								if(!guidelineCur.getUnitId().equals(guidelineInfo.getUnitId())){
									List uList = sgccIniUnitDAO.getAllParentsByUnitid(guidelineInfo.getUnitId());//节点所属单位的所有上级单位
									boolean doSave = true;
									if(uList != null&&uList.size() > 0){
										SgccIniUnit iniUnit = null;
										for(int j=0;j<uList.size();j++){
											iniUnit = (SgccIniUnit)uList.get(j);
											if(guidelineCur.getUnitId().equals(iniUnit.getUnitid())){
												doSave = false;
												break;
											}
										}
									}
									if(doSave==true){
										guidelineCur.setUnitId(guidelineInfo.getUnitId());
										sgccGuidelineInfoDAO.saveOrUpdate(guidelineCur);
									}
								}
							}
						}
					}
				}
			}
		}
	}

	public String ConvertGuidelineXDJSon(String parentId,String guideType) {
		String where = "";
		System.out.println("*************************** The guideType is "+guideType);
		if(guideType != null && guideType != "")
			where += " and ifpub = '"+guideType+"'";
		String sql = "select zb_seqno,realname,jldw,state,ifpub,unit_id,ifpercent,ifxd,xdsj,leaf from "
				   + "(select t.zb_seqno,t.realname,t.jldw,t.state,t.ifpub,t.unit_id,t.ifpercent,t.parentid,"
				   + "decode((select count(*) from sgcc_guideline_info_xd where zb_seqno = t.zb_seqno),'0','未下达','已下达') ifxd, d.xdsj,"
				   + "(select count(zb_seqno) from sgcc_guideline_info where parentid = t.zb_seqno) leaf "
				   + "from (select zb_seqno,realname,unit_id,jldw,state,ifpub,ifpercent,parentid from sgcc_guideline_info "
				   + "start with zb_seqno = 'd' connect by prior zb_seqno = parentid) t,"
				   + "(select distinct zb_seqno,(select max(to_char(xdsj,'yyyy-mm-dd hh:mi:ss')) from sgcc_guideline_info_xd where zb_seqno = x.zb_seqno) xdsj "
				   + "from sgcc_guideline_info_xd x) d where t.zb_seqno = d.zb_seqno(+)) tab where zb_seqno like '%' ";
		System.out.println("-----------------sql is "+sql);
		List list = this.systemDao.getDataAutoCloseSes(sql);
		String jsonStr = "[{@node,expanded:true}]";
		for (int i = 0; i < list.size(); i++) {
			Object[] rs = (Object[]) list.get(i);
			String nodeStr = "id:'"+rs[0]+"'"
						   + ",realname:'"+rs[1]+"'";
			if(i == 0) {
				nodeStr = nodeStr + ",jldw:'',state:'',ifpub:'',ssdw:'',ifxd:'',xdsj:'',disabled:true,checked:false,uiProvider:'col',";
			} else {
				if(rs[2] == null)
					nodeStr = nodeStr + ",jldw:''";
				else
					nodeStr = nodeStr + ",jldw:'"+rs[2]+"'";
				if(rs[3] == null)
					nodeStr = nodeStr + ",state:''";
				else
					nodeStr = nodeStr + ",state:'"+rs[3]+"'";
				if(rs[4] == null)
					nodeStr = nodeStr + ",ifpub:''";
				else
					nodeStr = nodeStr + ",ifpub:'"+rs[4]+"'";
				if(rs[5] == null)
					nodeStr = nodeStr + ",ssdw:''";
				else
					nodeStr = nodeStr + ",ssdw:'"+rs[5]+"'";
				if(rs[7] == null)
					nodeStr = nodeStr + ",ifxd:''";
				else
					nodeStr = nodeStr + ",ifxd:'"+rs[7]+"'";
				if(rs[8] == null)
					nodeStr = nodeStr + ",xdsj:''";
				else
					nodeStr = nodeStr + ",xdsj:'"+rs[8]+"'";
				
				nodeStr += ",checked:false,uiProvider:'col',";
			}
				
			int l = Integer.parseInt(rs[9].toString());
			if (l > 0) {
				nodeStr += "children:[";
				for (int x = 1; x < l; x++) {
					nodeStr += "{@node},";
				}
				nodeStr += "{@node}]";
			} else {
				nodeStr += "leaf:true";
			}
			jsonStr = jsonStr.replaceFirst("@node", nodeStr);
		}
		return jsonStr;
	}
	
	public String getDownHistoryTree(String unitId) {
		String jsonStr = "[{@node,expanded:true}]";
		System.out.println("The unitId is "+unitId);
		if(unitId == null)
			return jsonStr;
		else {
			String sql = "";
			sql = "select * from sgcc_guideline_info_xd t where t.unitid='"+unitId+"'";
			List lists = this.systemDao.getDataAutoCloseSes(sql);
			if(lists.size() == 0)
				return jsonStr;
			else {
				sql = "select t.zb_seqno,t.realname,t.jldw, "
					+ "to_char((select xdsj from sgcc_guideline_info_xd where zb_seqno = t.zb_seqno and unitid = '"+unitId+"'), 'yyyy-mm-dd HH24:MI:SS') xsdj, "
					+ "(select count(*) from (select * from sgcc_guideline_info where zb_seqno in (select zb_seqno from sgcc_guideline_info_xd "
					+ "where unitid = '"+unitId+"'  union select 'd' zb_seqno from dual)) where parentid = t.zb_seqno) leaf "
					+ "from sgcc_guideline_info t where t.zb_seqno in (select zb_seqno from sgcc_guideline_info_xd "
					+ "where unitid = '"+unitId+"' union select 'd' zb_seqno from dual) "
					+ "start with t.zb_seqno = 'd' connect by prior t.zb_seqno = t.parentid";
				System.out.println("------------------------------------- The sql is "+sql);
				List list = this.systemDao.getDataAutoCloseSes(sql);
				for (int i = 0; i < list.size(); i++) {
					Object[] rs = (Object[]) list.get(i);
					String nodeStr = "id:'"+rs[0]+"'"
								   + ",realname:'"+rs[1]+"'";
					if(rs[2] == null)
						nodeStr = nodeStr + ",jldw:''";
					else
						nodeStr = nodeStr + ",jldw:'"+rs[2]+"'";
					
					if(rs[3] == null)
						nodeStr = nodeStr + ",xdsj:''";
					else
						nodeStr = nodeStr + ",xdsj:'"+rs[3]+"'";
					
					nodeStr = nodeStr + ",checked:false,uiProvider:'col',";
					
					int l = Integer.parseInt(rs[4].toString());
					if (l > 0) {
						nodeStr += "children:[";
						for (int x = 1; x < l; x++) {
							nodeStr += "{@node},";
						}
						nodeStr += "{@node}]";
					} else {
						nodeStr += "leaf:true";
					}
					jsonStr = jsonStr.replaceFirst("@node", nodeStr);
				}
				return jsonStr;
			}
		}
	}
	
	public String getUnitName(String unitid) {
		SgccIniUnit unit = (SgccIniUnit)sgccIniUnitDAO.findBeanByProperty("com.sgepit.frame.sysman.hbm.SgccIniUnit", "unitid", unitid);
		System.out.println("The unit is "+unit);
		System.out.println("The unitname is "+unit.getUnitname());
		if(unit != null)
			return unit.getUnitname();
		else
			return "";
	}
	
	/**
	 * 工资科目中判断指标名称是否存在
	 * @param realname
	 * @return 1:存在 0:不存在
	 * @author zhangh
	 * @version 2012.04.05
	 */
	public String checkRealName(String realname, String parentid){
		String where = " realname = '"+realname+"' and parentid = '"+parentid+"' ";
		List list = this.sgccIniUnitDAO.findByWhere(SgccGuidelineInfo.class.getName(), where);
		if (list.size()>0) {
			return "1";
		}else{
			return "0";
		}
	}
}
