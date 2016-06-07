package com.sgepit.pmis.rlzj.dao;

import java.util.Date;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.HrManWorkexep;

/**
 * A data access object (DAO) providing persistence and search support for
 * HrManWorkexep entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.HrManWorkexep
 * @author MyEclipse Persistence Tools
 */

public class HrManWorkexepDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(HrManWorkexepDAO.class);
	// property constants
	public static final String PERSONNUM = "personnum";
	public static final String COMPANY = "company";
	public static final String COMPANYTYPE = "companytype";
	public static final String ACHIEVEMENT = "achievement";
	public static final String POSNAME = "posname";
	public static final String PROFESSIONALPOST = "professionalpost";
	public static final String WORKTYPE = "worktype";
	public static final String OTHERINFO = "otherinfo";
	public static final String LEAVEREASON = "leavereason";
	public static final String MEMO = "memo";
	public static final String MEMOC1 = "memoc1";
	public static final String MEMOC2 = "memoc2";
	public static final String MEMOC3 = "memoc3";
	public static final String MEMOC4 = "memoc4";
	public static final String MEMOC5 = "memoc5";
	public static final String MEMOC6 = "memoc6";
	public static final String MEMOC7 = "memoc7";
	public static final String MEMOC8 = "memoc8";
	public static final String MEMOC9 = "memoc9";
	public static final String MEMOC10 = "memoc10";
	public static final String MEMON1 = "memon1";
	public static final String MEMON2 = "memon2";
	public static final String MEMON3 = "memon3";
	public static final String MEMON4 = "memon4";
	public static final String MEMON5 = "memon5";
	public static final String MEMOLONG = "memolong";
	public static final String MEMOBLOB = "memoblob";

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.rlzy.hbm.HrManWorkexep";
	}

	public void save(HrManWorkexep transientInstance) {
		log.debug("saving HrManWorkexep instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(HrManWorkexep persistentInstance) {
		log.debug("deleting HrManWorkexep instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public HrManWorkexep findById(java.lang.String id) {
		log.debug("getting HrManWorkexep instance with id: " + id);
		try {
			HrManWorkexep instance = (HrManWorkexep) getHibernateTemplate()
					.get("com.sgepit.pmis.rlzj.hbm.HrManWorkexep", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(HrManWorkexep instance) {
		log.debug("finding HrManWorkexep instance by example");
		try {
			List results = getHibernateTemplate().findByExample(instance);
			log.debug("find by example successful, result size: "
					+ results.size());
			return results;
		} catch (RuntimeException re) {
			log.error("find by example failed", re);
			throw re;
		}
	}

	public List findByProperty(String propertyName, Object value) {
		log.debug("finding HrManWorkexep instance with property: "
				+ propertyName + ", value: " + value);
		try {
			String queryString = "from HrManWorkexep as model where model."
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

	public List findByCompany(Object company) {
		return findByProperty(COMPANY, company);
	}

	public List findByCompanytype(Object companytype) {
		return findByProperty(COMPANYTYPE, companytype);
	}

	public List findByAchievement(Object achievement) {
		return findByProperty(ACHIEVEMENT, achievement);
	}

	public List findByPosname(Object posname) {
		return findByProperty(POSNAME, posname);
	}

	public List findByProfessionalpost(Object professionalpost) {
		return findByProperty(PROFESSIONALPOST, professionalpost);
	}

	public List findByWorktype(Object worktype) {
		return findByProperty(WORKTYPE, worktype);
	}

	public List findByOtherinfo(Object otherinfo) {
		return findByProperty(OTHERINFO, otherinfo);
	}

	public List findByLeavereason(Object leavereason) {
		return findByProperty(LEAVEREASON, leavereason);
	}

	public List findByMemo(Object memo) {
		return findByProperty(MEMO, memo);
	}

	public List findByMemoc1(Object memoc1) {
		return findByProperty(MEMOC1, memoc1);
	}

	public List findByMemoc2(Object memoc2) {
		return findByProperty(MEMOC2, memoc2);
	}

	public List findByMemoc3(Object memoc3) {
		return findByProperty(MEMOC3, memoc3);
	}

	public List findByMemoc4(Object memoc4) {
		return findByProperty(MEMOC4, memoc4);
	}

	public List findByMemoc5(Object memoc5) {
		return findByProperty(MEMOC5, memoc5);
	}

	public List findByMemoc6(Object memoc6) {
		return findByProperty(MEMOC6, memoc6);
	}

	public List findByMemoc7(Object memoc7) {
		return findByProperty(MEMOC7, memoc7);
	}

	public List findByMemoc8(Object memoc8) {
		return findByProperty(MEMOC8, memoc8);
	}

	public List findByMemoc9(Object memoc9) {
		return findByProperty(MEMOC9, memoc9);
	}

	public List findByMemoc10(Object memoc10) {
		return findByProperty(MEMOC10, memoc10);
	}

	public List findByMemon1(Object memon1) {
		return findByProperty(MEMON1, memon1);
	}

	public List findByMemon2(Object memon2) {
		return findByProperty(MEMON2, memon2);
	}

	public List findByMemon3(Object memon3) {
		return findByProperty(MEMON3, memon3);
	}

	public List findByMemon4(Object memon4) {
		return findByProperty(MEMON4, memon4);
	}

	public List findByMemon5(Object memon5) {
		return findByProperty(MEMON5, memon5);
	}

	public List findByMemolong(Object memolong) {
		return findByProperty(MEMOLONG, memolong);
	}

	public List findByMemoblob(Object memoblob) {
		return findByProperty(MEMOBLOB, memoblob);
	}

	public List findAll() {
		log.debug("finding all HrManWorkexep instances");
		try {
			String queryString = "from HrManWorkexep";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public HrManWorkexep merge(HrManWorkexep detachedInstance) {
		log.debug("merging HrManWorkexep instance");
		try {
			HrManWorkexep result = (HrManWorkexep) getHibernateTemplate()
					.merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(HrManWorkexep instance) {
		log.debug("attaching dirty HrManWorkexep instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(HrManWorkexep instance) {
		log.debug("attaching clean HrManWorkexep instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static HrManWorkexepDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (HrManWorkexepDAO) ctx.getBean("HrManWorkexepDAO");
	}
}