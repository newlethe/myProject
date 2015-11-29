package com.sgepit.pmis.rlzj.dao;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.HrManContract;

public class HrManContractDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(HrManContractDAO.class);
	public static final String ENTRYDATE="entryDate";
	public static final String WORKYEARS="workYears";
	public static final String LEFTDATE="leftDate";
	public static final String SIGNEDDATE="signedDate";
	public static final String ENDDATE="endDate";
	public static final String EMPLOYMODUS="employModus";
	public static final String EXTENDS1="extend1";
	public static final String PERSONNUM="personnum";
	@Override
	protected void initDao() {
		sBeanName="com.sgepit.pmis.rlzj.hbm.HrManContract";
	}
	//保存
	public void save(HrManContract transientInstance){
		
		log.debug("saving HrManContract instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
		
	}
	
	public void delete(HrManContract persistentInstance) {
		log.debug("deleting HrManContract instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}
	
	public HrManContract merge(HrManContract detachedInstance) {
		log.debug("merging HrManEducation instance");
		try {
			HrManContract result = (HrManContract) getHibernateTemplate()
					.merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}
	
	public HrManContract findById(java.lang.String id) {
		log.debug("getting HrManContract instance with id: " + id);
		try {
			HrManContract instance = (HrManContract) getHibernateTemplate()
					.get(HrManContract.class, id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}
	
	public List findByProperty(String propertyName, Object value) {
		log.debug("finding HrManContract instance with property: "
				+ propertyName + ", value: " + value);
		try {
			String queryString = "from HrManContract as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}
	
	
	public List findByPersonnum(Object personnum) {
		return findByProperty(PERSONNUM, personnum);
	}
	
	public static HrManContractDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (HrManContractDAO) ctx.getBean("HrManContractDAO");
	}
	
	
	public void updateEmpTypeToHrInfo(String personNum,String EmpType){
		   Session  session=this.getSession();
		   String hql="update HrManInfo set userEmpType=:EmpType where userid=:PersonNum";
		   Query query=session.createQuery(hql);
		    query.setString("EmpType", EmpType);
		    query.setString("PersonNum", personNum);
            query.executeUpdate();		
		
	}
	
	/**
	 *   获取所有合同并对所有合同进行工龄计算
	 * @return
	 */
	public List getAllContract(){
		Session session=this.getSession();
		String hql="from HrManContract";
		Query query=session.createQuery(hql);
		return query.list();
		
	}
	
	//跟新工作年限
	public void updateContractByWorkYears(String seqnum, Long workYears ){
		 Session  session=this.getSession();
		 String hql="update HrManContract set workYears=:workYear  where seqnum=:seqnum";
		 Query query=session.createQuery(hql);
		       query.setLong("workYear", workYears);
		       query.setString("seqnum", seqnum);
		       query.executeUpdate();
	}
	
	
	
	public int getUserContractByPersonNum(String personnum){
		  Session session=this.getSession();
		  String sql="select count(*) from hr_man_contract where personnum=?";
		  Query query=session.createSQLQuery(sql);
		    query.setString(0, personnum);
		 return query.list().size();
		
	}
}
