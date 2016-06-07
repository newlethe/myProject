package com.sgepit.pmis.rlzj.dao;

import java.util.Date;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.HrManJndj;

/**
 * A data access object (DAO) providing persistence and search support for
 * HrManJndj entities. Transaction control of the save(), update() and delete()
 * operations can directly support Spring container-managed transactions or they
 * can be augmented to handle user-managed Spring transactions. Each of these
 * methods provides additional information for how to configure it for the
 * desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.HrManJndj
 * @author MyEclipse Persistence Tools
 */

public class HrManJndjDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(HrManJndjDAO.class);
	// property constants
	public static final String GH = "gh";
	public static final String BM = "bm";
	public static final String NAME = "name";
	public static final String GW = "gw";
	public static final String FZDW = "fzdw";
	public static final String JNDJ = "jndj";
	public static final String JNZY = "jnzy";

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.rlzy.hbm.HrManJndj";
	}

	public void save(HrManJndj transientInstance) {
		log.debug("saving HrManJndj instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(HrManJndj persistentInstance) {
		log.debug("deleting HrManJndj instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public HrManJndj findById(java.lang.String id) {
		log.debug("getting HrManJndj instance with id: " + id);
		try {
			HrManJndj instance = (HrManJndj) getHibernateTemplate().get(
					"com.sgepit.pmis.rlzj.hbm.HrManJndj", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(HrManJndj instance) {
		log.debug("finding HrManJndj instance by example");
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
		log.debug("finding HrManJndj instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from HrManJndj as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List findByGh(Object gh) {
		return findByProperty(GH, gh);
	}

	public List findByBm(Object bm) {
		return findByProperty(BM, bm);
	}

	public List findByName(Object name) {
		return findByProperty(NAME, name);
	}

	public List findByGw(Object gw) {
		return findByProperty(GW, gw);
	}

	public List findByFzdw(Object fzdw) {
		return findByProperty(FZDW, fzdw);
	}

	public List findByJndj(Object jndj) {
		return findByProperty(JNDJ, jndj);
	}

	public List findByJnzy(Object jnzy) {
		return findByProperty(JNZY, jnzy);
	}

	public List findAll() {
		log.debug("finding all HrManJndj instances");
		try {
			String queryString = "from HrManJndj";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public HrManJndj merge(HrManJndj detachedInstance) {
		log.debug("merging HrManJndj instance");
		try {
			HrManJndj result = (HrManJndj) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(HrManJndj instance) {
		log.debug("attaching dirty HrManJndj instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(HrManJndj instance) {
		log.debug("attaching clean HrManJndj instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static HrManJndjDAO getFromApplicationContext(ApplicationContext ctx) {
		return (HrManJndjDAO) ctx.getBean("HrManJndjDAO");
	}
}