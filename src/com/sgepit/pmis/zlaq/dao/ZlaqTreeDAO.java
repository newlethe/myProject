package com.sgepit.pmis.zlaq.dao;

import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.pmis.zlaq.hbm.ZlaqTree;

/**
 * A data access object (DAO) providing persistence and search support for
 * ZlaqTree entities. Transaction control of the save(), update() and delete()
 * operations can directly support Spring container-managed transactions or they
 * can be augmented to handle user-managed Spring transactions. Each of these
 * methods provides additional information for how to configure it for the
 * desired type of transaction control.
 * 
 * @see com.sgepit.pmis.zlaq.hbm.ZlaqTree
 * @author MyEclipse Persistence Tools
 */

public class ZlaqTreeDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(ZlaqTreeDAO.class);

	// property constants

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.zlaq.hbm.ZlaqTree";
	}

	public void save(ZlaqTree transientInstance) {
		log.debug("saving ZlaqTree instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(ZlaqTree persistentInstance) {
		log.debug("deleting ZlaqTree instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public ZlaqTree findById(java.lang.String id) {
		log.debug("getting ZlaqTree instance with id: " + id);
		try {
			ZlaqTree instance = (ZlaqTree) getHibernateTemplate().get(
					"com.sgepit.pmis.zlaq.hbm.ZlaqTree", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(ZlaqTree instance) {
		log.debug("finding ZlaqTree instance by example");
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
		log.debug("finding ZlaqTree instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from ZlaqTree as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List findAll() {
		log.debug("finding all ZlaqTree instances");
		try {
			String queryString = "from ZlaqTree";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public ZlaqTree merge(ZlaqTree detachedInstance) {
		log.debug("merging ZlaqTree instance");
		try {
			ZlaqTree result = (ZlaqTree) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(ZlaqTree instance) {
		log.debug("attaching dirty ZlaqTree instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(ZlaqTree instance) {
		log.debug("attaching clean ZlaqTree instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static ZlaqTreeDAO getInstence() {
		return (ZlaqTreeDAO) Constant.wact.getBean("ZlaqTreeDAO");
	}

	public static ZlaqTreeDAO getFromApplicationContext(ApplicationContext ctx) {
		return (ZlaqTreeDAO) ctx.getBean("ZlaqTreeDAO");
	}
}