package com.sgepit.pmis.rlzj.dao;

import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.HrManJf;

/**
 * A data access object (DAO) providing persistence and search support for
 * HrManJf entities. Transaction control of the save(), update() and delete()
 * operations can directly support Spring container-managed transactions or they
 * can be augmented to handle user-managed Spring transactions. Each of these
 * methods provides additional information for how to configure it for the
 * desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.HrManJf
 * @author MyEclipse Persistence Tools
 */

public class HrManJfDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(HrManJfDAO.class);
	// property constants
	public static final String PERSONNUM = "personnum";
	public static final String ND = "nd";
	public static final String NDJF = "ndjf";
	public static final String SNDCBJF = "sndcbjf";
	public static final String BNDCBJF = "bndcbjf";
	public static final String NZSH = "nzsh";

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.rlzy.hbm.HrManJf";
	}

	public void save(HrManJf transientInstance) {
		log.debug("saving HrManJf instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(HrManJf persistentInstance) {
		log.debug("deleting HrManJf instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public HrManJf findById(java.lang.String id) {
		log.debug("getting HrManJf instance with id: " + id);
		try {
			HrManJf instance = (HrManJf) getHibernateTemplate().get(
					"com.sgepit.pmis.rlzj.hbm.HrManJf", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(HrManJf instance) {
		log.debug("finding HrManJf instance by example");
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
		log.debug("finding HrManJf instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from HrManJf as model where model."
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

	public List findByNd(Object nd) {
		return findByProperty(ND, nd);
	}

	public List findByNdjf(Object ndjf) {
		return findByProperty(NDJF, ndjf);
	}

	public List findBySndcbjf(Object sndcbjf) {
		return findByProperty(SNDCBJF, sndcbjf);
	}

	public List findByBndcbjf(Object bndcbjf) {
		return findByProperty(BNDCBJF, bndcbjf);
	}

	public List findByNzsh(Object nzsh) {
		return findByProperty(NZSH, nzsh);
	}

	public List findAll() {
		log.debug("finding all HrManJf instances");
		try {
			String queryString = "from HrManJf";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public HrManJf merge(HrManJf detachedInstance) {
		log.debug("merging HrManJf instance");
		try {
			HrManJf result = (HrManJf) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(HrManJf instance) {
		log.debug("attaching dirty HrManJf instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(HrManJf instance) {
		log.debug("attaching clean HrManJf instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static HrManJfDAO getFromApplicationContext(ApplicationContext ctx) {
		return (HrManJfDAO) ctx.getBean("HrManJfDAO");
	}
}