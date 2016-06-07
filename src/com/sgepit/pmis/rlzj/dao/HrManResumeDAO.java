package com.sgepit.pmis.rlzj.dao;

import java.util.Date;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.HrManResume;

/**
 * A data access object (DAO) providing persistence and search support for
 * HrManResume entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.HrManResume
 * @author MyEclipse Persistence Tools
 */

public class HrManResumeDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(HrManResumeDAO.class);
	// property constants
	public static final String PERSONNUM = "personnum";
	public static final String LX = "lx";
	public static final String DW = "dw";
	public static final String CSGZ = "csgz";
	public static final String DRZW = "drzw";
	public static final String ZMR = "zmr";
	public static final String BZ = "bz";
	public static final String ISTOP = "istop";

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.rlzy.hbm.HrManResume";
	}

	public void save(HrManResume transientInstance) {
		log.debug("saving HrManResume instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(HrManResume persistentInstance) {
		log.debug("deleting HrManResume instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public HrManResume findById(java.lang.String id) {
		log.debug("getting HrManResume instance with id: " + id);
		try {
			HrManResume instance = (HrManResume) getHibernateTemplate().get(
					"com.sgepit.pmis.rlzj.hbm.HrManResume", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(HrManResume instance) {
		log.debug("finding HrManResume instance by example");
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
		log.debug("finding HrManResume instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from HrManResume as model where model."
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

	public List findByLx(Object lx) {
		return findByProperty(LX, lx);
	}

	public List findByDw(Object dw) {
		return findByProperty(DW, dw);
	}

	public List findByCsgz(Object csgz) {
		return findByProperty(CSGZ, csgz);
	}

	public List findByDrzw(Object drzw) {
		return findByProperty(DRZW, drzw);
	}

	public List findByZmr(Object zmr) {
		return findByProperty(ZMR, zmr);
	}

	public List findByBz(Object bz) {
		return findByProperty(BZ, bz);
	}

	public List findByIstop(Object istop) {
		return findByProperty(ISTOP, istop);
	}

	public List findAll() {
		log.debug("finding all HrManResume instances");
		try {
			String queryString = "from HrManResume";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public HrManResume merge(HrManResume detachedInstance) {
		log.debug("merging HrManResume instance");
		try {
			HrManResume result = (HrManResume) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(HrManResume instance) {
		log.debug("attaching dirty HrManResume instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(HrManResume instance) {
		log.debug("attaching clean HrManResume instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static HrManResumeDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (HrManResumeDAO) ctx.getBean("HrManResumeDAO");
	}
}