package com.sgepit.pmis.wzgl.dao;

import java.math.BigDecimal;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.SQLQuery;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.wzgl.hbm.ViewWzCollectApply;

public class ViewWzCollectApplyDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(ViewWzCollectApplyDAO.class);

	protected void initDao() {
		sBeanName = "com.sgepit.pmis.wzgl.hbm.ViewWzCollectApply";
		super.initDao();
	}
	
	public static ViewWzCollectApplyDAO getFromApplicationContext(ApplicationContext ctx) {
		return (ViewWzCollectApplyDAO) ctx.getBean("ViewWzCollectApplyDAO");
	}
	public static ViewWzCollectApplyDAO getInstence(){
		return (ViewWzCollectApplyDAO)Constant.wact.getBean("ViewWzCollectApplyDAO");
	}
	public List getCollectApply(String whereStr,Integer start, Integer limit){
		String sql = "select r1.* from view_wz_collect_apply r1 where " + whereStr;
		String sqlCount = "select count(bm) from view_wz_collect_apply r1 where " + whereStr;
		SQLQuery query = getSession().createSQLQuery(sql).addEntity("wiew_wz_collect_apply", ViewWzCollectApply.class);
		
		List list = this.getDataAutoCloseSes(sqlCount);;
		Integer size =0 ;
		if(list!=null && list.size()>0){
			size =  ((BigDecimal)list.get(0)).intValue();
		}
		
		if(start!=null&&limit!=null){
			query.setFirstResult(start.intValue());
			query.setMaxResults(limit.intValue());
		}		
		List rtnList = query.list();	
		rtnList.add(size);
		return rtnList;
	}
}
