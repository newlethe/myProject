package com.sgepit.pmis.rlzj.dao;

import java.util.Date;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.HrManArt;

/**
 * A data access object (DAO) providing persistence and search support for
 * HrManArt entities. Transaction control of the save(), update() and delete()
 * operations can directly support Spring container-managed transactions or they
 * can be augmented to handle user-managed Spring transactions. Each of these
 * methods provides additional information for how to configure it for the
 * desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.HrManArt
 * @author MyEclipse Persistence Tools
 */

public class HrManArtDAO  extends IBaseDAO {
	private static final Log log = LogFactory.getLog(HrManArtDAO.class);
	// property constants
	public static final String PERSONNUM = "personnum";
	public static final String ZYJSZG = "zyjszg";
	public static final String ZYJSZGLB = "zyjszglb";
	public static final String FZJG = "fzjg";
	public static final String FZWH = "fzwh";
	public static final String SFPR = "sfpr";
	public static final String PRDW = "prdw";
	public static final String PRWH = "prwh";

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.rlzy.hbm.HrManArt";
	}

	public void save(HrManArt transientInstance) {
		log.debug("saving HrManArt instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(HrManArt persistentInstance) {
		log.debug("deleting HrManArt instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public HrManArt findById(java.lang.String id) {
		log.debug("getting HrManArt instance with id: " + id);
		try {
			HrManArt instance = (HrManArt) getHibernateTemplate().get(
					"com.sgepit.pmis.rlzj.hbm.HrManArt", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(HrManArt instance) {
		log.debug("finding HrManArt instance by example");
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
		log.debug("finding HrManArt instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from HrManArt as model where model."
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

	public List findByZyjszg(Object zyjszg) {
		return findByProperty(ZYJSZG, zyjszg);
	}

	public List findByZyjszglb(Object zyjszglb) {
		return findByProperty(ZYJSZGLB, zyjszglb);
	}

	public List findByFzjg(Object fzjg) {
		return findByProperty(FZJG, fzjg);
	}

	public List findByFzwh(Object fzwh) {
		return findByProperty(FZWH, fzwh);
	}

	public List findBySfpr(Object sfpr) {
		return findByProperty(SFPR, sfpr);
	}

	public List findByPrdw(Object prdw) {
		return findByProperty(PRDW, prdw);
	}

	public List findByPrwh(Object prwh) {
		return findByProperty(PRWH, prwh);
	}

	public List findAll() {
		log.debug("finding all HrManArt instances");
		try {
			String queryString = "from HrManArt";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public HrManArt merge(HrManArt detachedInstance) {
		log.debug("merging HrManArt instance");
		try {
			HrManArt result = (HrManArt) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(HrManArt instance) {
		log.debug("attaching dirty HrManArt instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(HrManArt instance) {
		log.debug("attaching clean HrManArt instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static HrManArtDAO getFromApplicationContext(ApplicationContext ctx) {
		return (HrManArtDAO) ctx.getBean("HrManArtDAO");
	}
}