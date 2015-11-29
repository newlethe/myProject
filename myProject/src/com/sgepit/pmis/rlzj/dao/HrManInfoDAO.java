package com.sgepit.pmis.rlzj.dao;

import java.util.Date;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.HrManInfo;

/**
 * A data access object (DAO) providing persistence and search support for
 * HrManInfo entities. Transaction control of the save(), update() and delete()
 * operations can directly support Spring container-managed transactions or they
 * can be augmented to handle user-managed Spring transactions. Each of these
 * methods provides additional information for how to configure it for the
 * desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.HrManInfo
 * @author MyEclipse Persistence Tools
 */

public class HrManInfoDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(HrManInfoDAO.class);
	// property constants
	public static final String REALNAME = "realname";
	public static final String SEX = "sex";
	public static final String PHONE = "phone";
	public static final String MOBILE = "mobile";
	public static final String EMAIL = "email";
	public static final String IM = "im";
	public static final String ORGID = "orgid";
	public static final String ORGNAME = "orgname";
	public static final String POSID = "posid";
	public static final String POSNAME = "posname";
	public static final String ONTHEJOB = "onthejob";
	public static final String NATIVEPLACE = "nativeplace";
	public static final String RACE = "race";
	public static final String BIRTHDAY = "birthday";
	public static final String EDURECORD = "edurecord";
	public static final String HEIGHT = "height";
	public static final String WEIGHT = "weight";
	public static final String POLITICALFEATURES = "politicalfeatures";
	public static final String PAPERSTYPE = "paperstype";
	public static final String PAPERSNO = "papersno";
	public static final String MARITALSTATUS = "maritalstatus";
	public static final String PROFESSIONALPOST = "professionalpost";
	public static final String HOMEADDRESS = "homeaddress";
	public static final String STATUS = "status";
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
		sBeanName = "com.sgepit.pmis.rlzy.hbm.HrManInfo";
	}

	public void save(HrManInfo transientInstance) {
		log.debug("saving HrManInfo instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(HrManInfo persistentInstance) {
		log.debug("deleting HrManInfo instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public HrManInfo findById(java.lang.String id) {
		log.debug("getting HrManInfo instance with id: " + id);
		try {
			HrManInfo instance = (HrManInfo) getHibernateTemplate().get(
					"com.sgepit.pmis.rlzj.hbm.HrManInfo", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(HrManInfo instance) {
		log.debug("finding HrManInfo instance by example");
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
		log.debug("finding HrManInfo instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from HrManInfo as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List findByRealname(Object realname) {
		return findByProperty(REALNAME, realname);
	}

	public List findBySex(Object sex) {
		return findByProperty(SEX, sex);
	}

	public List findByPhone(Object phone) {
		return findByProperty(PHONE, phone);
	}

	public List findByMobile(Object mobile) {
		return findByProperty(MOBILE, mobile);
	}

	public List findByEmail(Object email) {
		return findByProperty(EMAIL, email);
	}

	public List findByIm(Object im) {
		return findByProperty(IM, im);
	}

	public List findByOrgid(Object orgid) {
		return findByProperty(ORGID, orgid);
	}

	public List findByOrgname(Object orgname) {
		return findByProperty(ORGNAME, orgname);
	}

	public List findByPosid(Object posid) {
		return findByProperty(POSID, posid);
	}

	public List findByPosname(Object posname) {
		return findByProperty(POSNAME, posname);
	}

	public List findByOnthejob(Object onthejob) {
		return findByProperty(ONTHEJOB, onthejob);
	}

	public List findByNativeplace(Object nativeplace) {
		return findByProperty(NATIVEPLACE, nativeplace);
	}

	public List findByRace(Object race) {
		return findByProperty(RACE, race);
	}

	public List findByBirthday(Object birthday) {
		return findByProperty(BIRTHDAY, birthday);
	}

	public List findByEdurecord(Object edurecord) {
		return findByProperty(EDURECORD, edurecord);
	}

	public List findByHeight(Object height) {
		return findByProperty(HEIGHT, height);
	}

	public List findByWeight(Object weight) {
		return findByProperty(WEIGHT, weight);
	}

	public List findByPoliticalfeatures(Object politicalfeatures) {
		return findByProperty(POLITICALFEATURES, politicalfeatures);
	}

	public List findByPaperstype(Object paperstype) {
		return findByProperty(PAPERSTYPE, paperstype);
	}

	public List findByPapersno(Object papersno) {
		return findByProperty(PAPERSNO, papersno);
	}

	public List findByMaritalstatus(Object maritalstatus) {
		return findByProperty(MARITALSTATUS, maritalstatus);
	}

	public List findByProfessionalpost(Object professionalpost) {
		return findByProperty(PROFESSIONALPOST, professionalpost);
	}

	public List findByHomeaddress(Object homeaddress) {
		return findByProperty(HOMEADDRESS, homeaddress);
	}

	public List findByStatus(Object status) {
		return findByProperty(STATUS, status);
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
		log.debug("finding all HrManInfo instances");
		try {
			String queryString = "from HrManInfo";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public HrManInfo merge(HrManInfo detachedInstance) {
		log.debug("merging HrManInfo instance");
		try {
			HrManInfo result = (HrManInfo) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(HrManInfo instance) {
		log.debug("attaching dirty HrManInfo instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(HrManInfo instance) {
		log.debug("attaching clean HrManInfo instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static HrManInfoDAO getFromApplicationContext(ApplicationContext ctx) {
		return (HrManInfoDAO) ctx.getBean("HrManInfoDAO");
	}
}