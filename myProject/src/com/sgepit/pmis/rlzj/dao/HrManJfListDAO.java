package com.sgepit.pmis.rlzj.dao;

import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.HrManJfList;

/**
 * A data access object (DAO) providing persistence and search support for
 * HrManJfList entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.HrManJfList
 * @author MyEclipse Persistence Tools
 */

public class HrManJfListDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(HrManJfListDAO.class);
	// property constants
	public static final String MAINNUM = "mainnum";
	public static final String LB = "lb";
	public static final String JFXM = "jfxm";
	public static final String JFJS = "jfjs";
	public static final String JFZ = "jfz";
	public static final String JFLJ = "jflj";
	public static final String DJR = "djr";
	public static final String BZ = "bz";

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.rlzy.hbm.HrManJfList";
	}

	public void save(HrManJfList transientInstance) {
		log.debug("saving HrManJfList instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(HrManJfList persistentInstance) {
		log.debug("deleting HrManJfList instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public HrManJfList findById(java.lang.String id) {
		log.debug("getting HrManJfList instance with id: " + id);
		try {
			HrManJfList instance = (HrManJfList) getHibernateTemplate().get(
					"com.sgepit.pmis.rlzj.hbm.HrManJfList", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(HrManJfList instance) {
		log.debug("finding HrManJfList instance by example");
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
		log.debug("finding HrManJfList instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from HrManJfList as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List findByMainnum(Object mainnum) {
		return findByProperty(MAINNUM, mainnum);
	}

	public List findByLb(Object lb) {
		return findByProperty(LB, lb);
	}

	public List findByJfxm(Object jfxm) {
		return findByProperty(JFXM, jfxm);
	}

	public List findByJfjs(Object jfjs) {
		return findByProperty(JFJS, jfjs);
	}

	public List findByJfz(Object jfz) {
		return findByProperty(JFZ, jfz);
	}

	public List findByJflj(Object jflj) {
		return findByProperty(JFLJ, jflj);
	}

	public List findByDjr(Object djr) {
		return findByProperty(DJR, djr);
	}

	public List findByBz(Object bz) {
		return findByProperty(BZ, bz);
	}

	public List findAll() {
		log.debug("finding all HrManJfList instances");
		try {
			String queryString = "from HrManJfList";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public HrManJfList merge(HrManJfList detachedInstance) {
		log.debug("merging HrManJfList instance");
		try {
			HrManJfList result = (HrManJfList) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(HrManJfList instance) {
		log.debug("attaching dirty HrManJfList instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(HrManJfList instance) {
		log.debug("attaching clean HrManJfList instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static HrManJfListDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (HrManJfListDAO) ctx.getBean("HrManJfListDAO");
	}
}