package com.sgepit.pmis.rlzj.dao;

import java.util.Date;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.HrManEducation;

/**
 * A data access object (DAO) providing persistence and search support for
 * HrManEducation entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.HrManEducation
 * @author MyEclipse Persistence Tools
 */

public class HrManEducationDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(HrManEducationDAO.class);
	// property constants
	public static final String PERSONNUM = "personnum";
	public static final String ORGANNAME = "organname";
	public static final String MAJOR = "major";
	public static final String ACHIEVEMENT = "achievement";
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
		sBeanName = "com.sgepit.pmis.rlzy.hbm.HrManEducation";
	}

	public void save(HrManEducation transientInstance) {
		log.debug("saving HrManEducation instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(HrManEducation persistentInstance) {
		log.debug("deleting HrManEducation instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public HrManEducation findById(java.lang.String id) {
		log.debug("getting HrManEducation instance with id: " + id);
		try {
			HrManEducation instance = (HrManEducation) getHibernateTemplate()
					.get("com.sgepit.pmis.rlzj.hbm.HrManEducation", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(HrManEducation instance) {
		log.debug("finding HrManEducation instance by example");
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
		log.debug("finding HrManEducation instance with property: "
				+ propertyName + ", value: " + value);
		try {
			String queryString = "from HrManEducation as model where model."
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

	public List findByOrganname(Object organname) {
		return findByProperty(ORGANNAME, organname);
	}

	public List findByMajor(Object major) {
		return findByProperty(MAJOR, major);
	}

	public List findByAchievement(Object achievement) {
		return findByProperty(ACHIEVEMENT, achievement);
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
		log.debug("finding all HrManEducation instances");
		try {
			String queryString = "from HrManEducation";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public HrManEducation merge(HrManEducation detachedInstance) {
		log.debug("merging HrManEducation instance");
		try {
			HrManEducation result = (HrManEducation) getHibernateTemplate()
					.merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(HrManEducation instance) {
		log.debug("attaching dirty HrManEducation instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(HrManEducation instance) {
		log.debug("attaching clean HrManEducation instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static HrManEducationDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (HrManEducationDAO) ctx.getBean("HrManEducationDAO");
	}
}